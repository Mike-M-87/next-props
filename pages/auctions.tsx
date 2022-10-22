import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { GET_AUCTIONS_BY_STATUS } from "../graphql/queries";


export type Auctions = Auction[]

export interface Auction {
    id: number
    title: string
    startTime: string
    proposalEndTime: string
    votingEndTime: string
    fundingAmount: number
    currencyType: string
    description: string
    createdDate: string
    status: string
    numWinners: number
    proposals: Proposal[]
}

export interface Proposal {
    address: string
    id: number
    title: string
    auctionId: number
    voteCount: number
    createdDate: string
}


export default function Auctions({ }) {
    const [auctions, setAuctions] = useState<Auction[]>(null)
    const [loading, setLoading] = useState<boolean>(true)

    async function FetchAuctions() {
        const response = await GET_AUCTIONS_BY_STATUS();
        const fetchedAuctions: Auctions = response.body
        fetchedAuctions.forEach((auction) => {
            auction.proposals.sort((a, b) => {
                return b.voteCount - a.voteCount
            })
        })
        localStorage.setItem("auctions", JSON.stringify(fetchedAuctions))
        setAuctions(fetchedAuctions)
        setLoading(false)
    };

    useEffect(() => {
        async function LoadAuctions() {
            if (localStorage.getItem("auctions")) {
                setAuctions(JSON.parse(localStorage.getItem("auctions")))
                setLoading(false)
            }
            await FetchAuctions()
        }
        LoadAuctions()
    }, [])

    return (
        loading ?
            <h1>Loading</h1> :
            <table>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Vote-Count</th>
                        <th></th>
                    </tr>
                </thead>

                {auctions && auctions.map((auction: Auction) => (
                    <tbody>
                        <tr><th colSpan={2}>{auction.title}</th></tr>
                        {
                            auction.proposals.map((propasal: Proposal) => (
                                <tr>
                                    <td>{propasal.address}</td>
                                    <td>{propasal.voteCount}</td>
                                    <td><button>Claim</button></td>
                                </tr>
                            ))}
                    </tbody>
                ))}
            </table>

    )
}
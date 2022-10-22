import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import Icon from "../../components/icon";
import Layout from "../../components/layout";
import Loader from "../../components/loading";
import { GET_COMMUNITY } from "../../graphql/queries";

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

export async function getServerSideProps({ params }) {
  return {
    props: {
      communityId: params.id,
    },
  };
}

export default function Community({ communityId }) {
  const [auctions, setAuctions] = useState<Auction[]>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { community } = useSelector((state: any) => state.community);


  useEffect(() => {
    async function FetchAuctions() {
      let id = parseInt(communityId)
      if (!id) {
        id = 1
      }
      const response = await GET_COMMUNITY(id);
      if (!response.success) {
        return
      }
      const fetchedAuctions: Auction[] = response.body.auctions
      fetchedAuctions.forEach((auction) => {
        auction.proposals.sort((a, b) => {
          return b.voteCount - a.voteCount
        })
      })
      localStorage.setItem("auctions" + communityId, JSON.stringify(fetchedAuctions))
      setAuctions(fetchedAuctions)
      setLoading(false)
    };

    async function LoadAuctions() {
      if (localStorage.getItem("auctions" + communityId)) {
        setAuctions(JSON.parse(localStorage.getItem("auctions" + communityId)))
        setLoading(false)
      } else {
        setLoading(true)

      }
      await FetchAuctions()
    }

    LoadAuctions()
  }, [communityId])

  return (
    <Layout>
      {loading ?
        <Loader /> :
        <table>
          <thead>
            <tr>
              <th>{"Winner's Address"}</th>
              <th className="vote-heading">Vote Count</th>
              <th>Amount</th>
              <th>Poap Reward</th>
            </tr>
          </thead>

          {auctions && auctions.map((auction: Auction, index) => (
            <tbody key={index}>
              <tr><th>
                <a target="_blank" rel="noreferrer" className="auction-title" href={`https://prop.house/${community?.name.replace(" ", "-").toLowerCase()}/${auction.title.replace(" ", "-").toLowerCase()}`}>
                  {auction.title}
                </a>
              </th></tr>
              {auction.proposals.map((propasal: Proposal, index) => (
                index < auction.numWinners &&
                <tr className="proposal-item" key={index}>
                  <td>{propasal.address}</td>
                  <td>{parseInt(propasal.voteCount.toString())}</td>
                  <td>{auction.fundingAmount} {auction.currencyType}</td>
                  <td><button onClick={() => alert("Please Connect your Wallet to Mint")} className="claim-button">Claim</button></td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      }
    </Layout>

  );
}

import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout";
import Loader from "../../components/loading";
import { GET_COMMUNITY } from "../../graphql/queries";
import { AUCTION_TEST, CACHED_COMMUNITY } from "../../data/communities";

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
  let response = CACHED_COMMUNITY.find((c)=>{return c.id == params.id})

  return {
    props: {
      communityId: params.id,
      communityName: response.name,
      communityImage: response.profileImageUrl,
    },
  };
}

export default function CommunityPage({ communityId, communityImage, communityName }) {
  const [auctions, setAuctions] = useState<Auction[]>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { community } = useSelector((state: any) => state.community);
  const isDesktopResolution = useMatchMedia('(min-width:800px)', true)

  useEffect(() => {
    async function FetchAuctions() {
      let id = parseInt(communityId) || 1

      const response = await GET_COMMUNITY(id);
      if (!response.success) {
        return
      }
      // const response = AUCTION_TEST;
      const fetchedAuctions: Auction[] = response.body.auctions
      fetchedAuctions.sort((a, b) => {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      })
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
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
        <meta name="color-scheme" content="light dark" />
        <meta
          property="og:title"
          content={communityName}
        />
        <meta property="og:description" content={communityName} />
        <meta
          property="og:url"
          content={"https://next-props.vercel.app/" + communityId}
        />
        <meta property="og:image" content={communityImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:alt" content={communityName} />
        <title>{communityName}</title>
        <link
          rel="icon"
          href={communityImage}
        />

      </Head>

      <Layout currentPageId={parseInt(communityId) || 1}>
        {loading ?
          <Loader /> :
          <table>
            <thead>
              <tr>
                <th style={{width:"5px"}}># Postion</th>
                <th>{"Winner's Address"}</th>
                <th className="vote-heading">Vote Count</th>
                <th>Amount</th>
                <th> Reward</th>
              </tr>
            </thead>

            {auctions && auctions.map((auction: Auction, index) => (
              (auction.status == "Closed" || auction.status == "Voting") &&
              <tbody key={index}>
                <tr><th>
                  <a target="_blank" rel="noreferrer" className="auction-title" href={`https://prop.house/${community?.name.replace(" ", "-").toLowerCase()}/${auction.title.replace(" ", "-").toLowerCase()}`}>
                    {auction.title}
                  </a>
                </th></tr>
                {auction.proposals.map((propasal: Proposal, index) => (
                  index < auction.numWinners &&
                    <tr  key={index}>
                    <td>{(index+1) + " >>"}</td>
                    <td className="prop-address">{isDesktopResolution ? propasal.address : addDotsForLongAddr(propasal.address)}</td>
                    <td>{parseInt(propasal.voteCount.toString())}</td>
                    <td>{auction.fundingAmount} {auction.currencyType} Ξ </td>
                    <td><button onClick={() => alert("Please Connect your Wallet to Mint")} className="claim-button">Claim NFT</button></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        }
      </Layout>
    </>
  );
}


export const useMatchMedia = (mediaQuery, initialValue) => {
  const [isMatching, setIsMatching] = useState(initialValue)
  useEffect(() => {
    const watcher = window.matchMedia(mediaQuery)
    setIsMatching(watcher.matches)
    const listener = (matches) => {
      setIsMatching(matches.matches)
    }

    if (watcher.addEventListener) {
      watcher.addEventListener('change', listener)
    }

    return () => {
      if (watcher.removeEventListener) {
        return watcher.removeEventListener('change', listener)
      }
    }
  }, [mediaQuery])

  return isMatching
}

const addDotsForLongAddr = (longAddr) => {
  let len = longAddr.length
  if (len < 20) {
    return longAddr;
  }
  return longAddr.slice(0, 6) + "..." + longAddr.slice(len - 4, len)
}

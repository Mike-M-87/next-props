import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import Layout from "../../components/layout";
import Loader from "../../components/loading";
import { GET_COMMUNITY } from "../../graphql/queries";
import store from "../../redux/store";

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
  return (<Provider store={store}>
    <CommunityDetails communityId={communityId} />
  </Provider>
  )
}


export function CommunityDetails({ communityId }) {
  const [auctions, setAuctions] = useState<Auction[]>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { communities } = useSelector((state: any) => state.communities);


  useEffect(() => {
    async function FetchAuctions() {
      const response = await GET_COMMUNITY(parseInt(communityId));
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
              <th>Address</th>
              <th>Vote-Count</th>
              <th></th>
            </tr>
          </thead>

          {auctions && auctions.map((auction: Auction, index) => (
            <tbody key={index}>
              <tr><th colSpan={2}>{auction.title}</th></tr>
              {
                auction.proposals.map((propasal: Proposal, index) => (
                  index < auction.numWinners &&
                  <tr key={index}>
                    <td>{propasal.address}</td>
                    <td>{propasal.voteCount}</td>
                    <td><button>Claim</button></td>
                  </tr>
                ))}
            </tbody>
          ))}
        </table>
      }
    </Layout>
  );
}

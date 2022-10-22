/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_COMMUNITIES } from "../graphql/queries";
import { communitiesActions, sidebarActions } from "../redux/reducers";


export interface Community {
  id: number
  contractAddress: string
  name: string
  profileImageUrl: string
  description: string
}


export default function Layout({ children }) {
  const { showNav } = useSelector((state: any) => state.sidebar);
  const [communities, setCommunities] = useState<Community[]>(null)
  const dispatch = useDispatch();

  useEffect(() => {
    async function FetchCommunities() {
      const response = await GET_COMMUNITIES();
      if (!response.success) {
        return
      }

      const fetchedCommunities: Community[] = response.body
      localStorage.setItem("communities", JSON.stringify(fetchedCommunities))
      setCommunities(fetchedCommunities)
    };

    async function LoadAuctions() {
      if (localStorage.getItem("communities")) {
        setCommunities(JSON.parse(localStorage.getItem("communities")))
      } else {
        await FetchCommunities()
      }
    }

    LoadAuctions()
  }, [])

  return (
    <>
      <nav className="sidebar">
        <button onClick={() => dispatch(sidebarActions.toggle())}>open</button>
        {communities &&
          communities.map((community, index) => (
            <Link href={`/community/${community.id}`} key={index}>
              <a className="community-item">
                <img
                  src={community.profileImageUrl}
                  width={50}
                  height={50}
                  alt={community.name}
                />
                {showNav && <span>{community.name}</span>}
              </a>
            </Link>
          ))}
      </nav>
      <main className="layout-main">
        {children}
      </main>
    </>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_COMMUNITIES } from "../graphql/queries";
import { communityActions, sidebarActions } from "../redux/reducers";
import Connect from "./connect";
import Icon from "./icon";
import Loader from "./loading";

export interface Community {
  id: number
  contractAddress: string
  name: string
  profileImageUrl: string
  description: string
}

export default function Layout({ children,currentPageId = 1 }) {
  const { showNav } = useSelector((state: any) => state.sidebar);
  const { community } = useSelector((state: any) => state.community);

  const [communities, setCommunities] = useState<Community[]>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch();

  useEffect(() => {
    async function FetchCommunities() {
      const response = await GET_COMMUNITIES();
      if (!response.success) {
        return
      }

      const fetchedCommunities: Community[] = response.body
      response.body.sort((a, b) => {
          return a.id - b.id
        })

      localStorage.setItem("communities", JSON.stringify(fetchedCommunities))
      setCommunities(fetchedCommunities)
      setLoading(false)
    };

    async function LoadCommunities() {
      if (localStorage.getItem("communities")) {
        setCommunities(JSON.parse(localStorage.getItem("communities")))
        setLoading(false)
      } else {
        setLoading(true)
      }
      await FetchCommunities()
    }
    LoadCommunities()
  }, [])

  return (
    loading ?
      <Loader /> :
      <>
        <nav className={showNav ? "sidebar" : "sidebarhide"}>
          <button className="sidebar-toggle" onClick={() => dispatch(sidebarActions.toggle())}>
            <Icon n="menu" />
          </button>
          {communities &&
            communities.sort().map((community, index) => (
              <Link href={`/community/${community.id}`} key={index}>
                <a onClick={() => dispatch(communityActions.update(community))} className={"community-item "+ (currentPageId == community.id ? "set-active" :"white") }>
                  <img
                    alt={community.name}
                    src={community.profileImageUrl}
                  />
                  <span style={{ visibility: showNav ? "visible" : "collapse", transition: "0.3s" }}>{community.name}</span>
                </a>
              </Link>
            ))}
        </nav>
        <main className={showNav ? "main" : "mainfull"} >
          <nav className="top-nav">
            <a href="https://prop.house" target="_blank" rel="noreferrer" className="prop-link">
              PROPHOUSE
            </a>
            <Connect />
          </nav>
          <h2 className="main-header">PropHouse Winners for{" "}
            <a target="_blank" rel="noreferrer" href={`https://prop.house/${community?.name.replace(" ", "-").toLowerCase()}`}>
              {community?.name || "Nouns"}
            </a>
          </h2>
          <p>Claim your noun poap here</p>
          {children}
        </main>
      </>
  );
}

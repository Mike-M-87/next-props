// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { GET_COMMUNITIES, GET_COMMUNITY } from "../../graphql/queries"

export default async function handler(req, res) {
  const communities =  await GET_COMMUNITIES() 

  let alldata = []
  communities.body.forEach( community => {
    const proposers =  GET_COMMUNITY(community.id) 
    alldata.push(proposers)
  });

  const allData = await Promise.all(alldata);


  allData.map((co) => {
    if(co.success){
      console.log(co)
    }
  });


  res.status(200).json(allData)
}


function getWinningProposalById(){

}
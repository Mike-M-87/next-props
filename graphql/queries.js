import axios from "axios";
const API_URL = "https://prod.backend.prop.house/graphql";

export async function _makeRequest({ query, variables, headers, getData }) {
  const result = {
    success: false,
    errorMessage: null,
    body: null,
  };

  try {
    headers = headers || {};
    const response = await axios.post(
      API_URL,
      { query, variables },
      { headers }
    );

    if (response.data.errors) {
      result.success = false;
      result.errorMessage = response.data.errors[0].message;
      result.body = null;
      return result;
    }

    const body = getData(response.data?.data);

    if (body === null) {
      result.success = false;
      result.errorMessage = "Data not available";
      result.body = null;
      return result;
    }

    if (body) {
      result.success = true;
      result.body = body;
    }

    return result;
  } catch (err) {
    result.errorMessage = err.message;
    return result;
  }
}


export function GET_COMMUNITIES() {
  const query = `
  {
    communities {
      id
      contractAddress
      name
      profileImageUrl
    }
  }
  `;
  return _makeRequest({
    query,
    getData: (data) => data.communities,
  });
}

export function GET_COMMUNITY(communityId) {
  const query = `
  query($id: Int!) {
    community(id: $id) {
      id
      contractAddress
      name
      profileImageUrl
      description
      numAuctions
      createdDate
      auctions {
        id
        title
        startTime
        proposalEndTime
        votingEndTime
        fundingAmount
        currencyType
        description
        createdDate
        status
        numWinners
        proposals {
          address
          id
          title
          auctionId
          voteCount
          createdDate
        }
      }
    }
  }
  `;
  return _makeRequest({
    query,
    variables: {
      id: communityId,
    },
    getData: (data) => data.community,
  });
}

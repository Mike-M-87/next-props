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

export function GET_AUCTIONS_BY_STATUS(status = "Closed") {
  const query = `
    query($status:AuctionStatus!) {
        auctionsByStatus(status: $status) {
            id
            title
            startTime
            proposalEndTime
            votingEndTime
            fundingAmount
            currencyType
            description
            createdDate
            balanceBlockTag
            status
            numWinners
            proposals {
                address
                id
                title
                what
                tldr
                auctionId
                votes {
                address
                id
                direction
                createdDate
                proposalId
                auctionId
                weight
                }
                voteCount
                createdDate
            }
            community {
                id
                contractAddress
                name
                profileImageUrl
                description
                numAuctions
                createdDate
            }
        }
    }`;
  return _makeRequest({
    query,
    variables: {
      status: status,
    },
    getData: (data) => data.auctionsByStatus,
  });
}

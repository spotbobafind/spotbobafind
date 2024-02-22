import _ from 'lodash';
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useSWRInfinite from "swr/infinite";
import { useSearchParams } from "react-router-dom";
import convert from "convert";

const BASE_API_URL = 'http://localhost:3000';
const PAGE_SIZE = 25;
const fetcher = (url) => fetch(url).then((res) => res.json());

function formatDistance(distance){
  const inMiles = convert(distance, "m").to("miles");
  const roundedDistance = Math.round(inMiles.toString() * 10) / 10;
  return roundedDistance;
}

export default function ResultsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get("location");
  const sort = searchParams.get("sort");

  const params = new URLSearchParams();
  if (location) {
    params.append("location", location);
  }
  if (sort) {
    params.append("sort", sort);
  }

  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.businesses) {
        return null;
      }
    
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) {
        return `${BASE_API_URL}/api/find?${params.toString()}`;
      }

      // add the cursor to the API endpoint
      const offset = `offset=${pageIndex * PAGE_SIZE}`;
      return `${BASE_API_URL}/api/find?${offset}&${params.toString()}`;
    },
    fetcher
  );

  const totalShops = Array.isArray(data) ? data[0]?.total : 0;
  const businesses = Array.isArray(data) ? [...data.map(d => d.businesses)] : [];
  const shops = _.unionBy(...businesses, "id");
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = shops.length === 0;
  const isReachingEnd =
    isEmpty || (shops && shops.length >= totalShops) || ((size * PAGE_SIZE) >= totalShops);
  const handleSort = sortType => () => {
    if (sort === sortType) {
      console.log('toggling off;')
      setSearchParams(oldParams => {
        const params = new URLSearchParams(oldParams.toString());
        params.delete("sort");
        return params;
      });
    } else {
      setSearchParams(oldParams => {
        const params = new URLSearchParams(oldParams.toString());
        params.set("sort", sortType);
        return params;
      });
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                Rating
                <IconButton onClick={handleSort('rating')} color={sort === 'rating' ? 'primary' : 'tertiary'}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Distance (miles)
                <IconButton onClick={handleSort('distance')} color={sort === 'distance' ? 'primary' : 'tertiary'}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!shops ? ('Loading Shops') : (shops
                .map((shop, idx) => {
                  return (
                    <TableRow hover tabIndex={-1} key={idx}>
                      <TableCell>{shop.rating}</TableCell>
                      <TableCell>{formatDistance(shop.distance)}</TableCell>
                      <TableCell>{shop.name}</TableCell>
                      <TableCell>{shop.location?.display_address}</TableCell>
                    </TableRow>
                  );
                }))
              }
          </TableBody>
        </Table>
      </TableContainer>
      <Button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "Loading..."
            : isReachingEnd
            ? "no more shops"
            : "Load More"}
        </Button>
    </Paper>
  );
}
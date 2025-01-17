import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { onError } from '@/utils/errorsHandler';
import { getMappedSort } from '@/utils/apiSortMapping';
import { getMappedMessage } from '@/utils/resMessageMapping';
import useAxiosIns from '@/hooks/useAxiosIns';
import toastConfig from '@/configs/toast';

export type TransactionSortAndFilterParams = {
  searchBookingId: string;
  paymentMethod: string;
  sort: string;
  range: string[] | any[] | undefined
};

const transactionService = ({ enableFetching }: { enableFetching: boolean }) => {
  const queryClient = useQueryClient();
  const axios = useAxiosIns();
  const [transactions, setTransactions] = useState<IPayment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  const buildQuery = ({ searchBookingId, range, paymentMethod, sort }: TransactionSortAndFilterParams) => {
    const query: any = {};
    if (searchBookingId?.trim()) query.bookingId = searchBookingId.trim();
    if (range) {
                if (range[0]) {
                    query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
                }
                if (range[1]) {
                    query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
                }
            }
    if (paymentMethod) query.method = paymentMethod;
    setQuery(JSON.stringify(query));
    if (sort) setSort(JSON.stringify(getMappedSort(sort)));
  };

  const searchTransactionsQuery = useQuery(['search-transactions', query, sort], {
    queryFn: () => {
      return axios.get<IResponseData<IPayment[]>>(`/bookings/transactions?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
  },
    keepPreviousData: true,
    enabled: false,
    onError: onError,
    onSuccess: res => {
      if (!res) return;
      setTransactions(res.data.data);
      setTotal(res.data.total as number);
    },
  });

  const getAllTransactionsQuery = useQuery(['transactions', page, limit], {
    queryFn: () => {
      if (!isSearching) {
          return axios.get<IResponseData<IPayment[]>>(`/bookings/transactions?skip=${limit * (page - 1)}&limit=${limit}`)
      }
  },
    keepPreviousData: true,
    enabled: enableFetching,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    onError: onError,
    onSuccess: res => {
      if (!res) return;
      setTransactions(res.data.data);
      setTotal(res.data.total as number);
    },
  });

  const getCsvTransactionsQuery = useQuery(['search-csv-transactions', query, sort], {
    queryFn: () => {
        return axios.get<IResponseData<IPayment[]>>(`/bookings/transactions?filter=${query}&sort=${sort}`)
    },
    keepPreviousData: true,
    enabled: false,
    onError: onError
})

const onFilterSearch = () => {
  setPage(1); // Reset to the first page when searching
  setIsSearching(true);
  setTimeout(() => searchTransactionsQuery.refetch(), 300);
};

// Reset filters and search
const onResetFilterSearch = () => {
  setPage(1); // Reset to the first page when resetting
  setIsSearching(false);
  setQuery('');
  setSort('');
  setTimeout(() => getAllTransactionsQuery.refetch(), 300);
};

useEffect(() => {
  if (isSearching) {
    searchTransactionsQuery.refetch();
  }
}, [page]);

  return {
    transactions,
    total,
    page,
    limit,
    setPage,
    onFilterSearch,
    onResetFilterSearch,
    buildQuery,
    searchTransactionsQuery,
    getAllTransactionsQuery,
    getCsvTransactionsQuery,
  };
};

export default transactionService;

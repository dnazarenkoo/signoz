import Graph from 'components/Graph';
import Spinner from 'components/Spinner';
import { initialQueriesMap, PANEL_TYPES } from 'constants/queryBuilder';
import { PANEL_TYPES_QUERY } from 'constants/queryBuilderQueryNames';
import { REACT_QUERY_KEY } from 'constants/reactQueryKeys';
import { GRAPH_TYPES } from 'container/NewDashboard/ComponentsSlider';
import { useGetQueryRange } from 'hooks/queryBuilder/useGetQueryRange';
import { useQueryBuilder } from 'hooks/queryBuilder/useQueryBuilder';
import useUrlQueryData from 'hooks/useUrlQueryData';
import getChartData from 'lib/getChartData';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { GlobalReducer } from 'types/reducer/globalTime';

import { Container, ErrorText } from './styles';

function TimeSeriesView(): JSX.Element {
	const { stagedQuery } = useQueryBuilder();

	const { selectedTime: globalSelectedTime, maxTime, minTime } = useSelector<
		AppState,
		GlobalReducer
	>((state) => state.globalTime);

	const { queryData: panelTypeParam } = useUrlQueryData<GRAPH_TYPES>(
		PANEL_TYPES_QUERY,
		PANEL_TYPES.TIME_SERIES,
	);

	const { data, isLoading, isError } = useGetQueryRange(
		{
			query: stagedQuery || initialQueriesMap.traces,
			graphType: panelTypeParam,
			selectedTime: 'GLOBAL_TIME',
			globalSelectedInterval: globalSelectedTime,
			params: {
				dataSource: 'traces',
			},
		},
		{
			queryKey: [
				REACT_QUERY_KEY.GET_QUERY_RANGE,
				globalSelectedTime,
				maxTime,
				minTime,
				stagedQuery,
				panelTypeParam,
			],
			enabled: !!stagedQuery && panelTypeParam === PANEL_TYPES.TIME_SERIES,
		},
	);

	const chartData = useMemo(
		() =>
			getChartData({
				queryData: [
					{
						queryData: data?.payload?.data?.result || [],
					},
				],
			}),
		[data],
	);

	return (
		<Container>
			{isLoading && <Spinner height="50vh" size="small" tip="Loading..." />}
			{isError && <ErrorText>{data?.error || 'Something went wrong'}</ErrorText>}
			{!isLoading && !isError && (
				<Graph
					animate={false}
					data={chartData}
					name="tracesExplorerGraph"
					type="line"
				/>
			)}
		</Container>
	);
}

export default TimeSeriesView;

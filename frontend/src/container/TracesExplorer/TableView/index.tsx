import { initialQueriesMap, PANEL_TYPES } from 'constants/queryBuilder';
import { REACT_QUERY_KEY } from 'constants/reactQueryKeys';
import { QueryTable } from 'container/QueryTable';
import { useGetQueryRange } from 'hooks/queryBuilder/useGetQueryRange';
import { useQueryBuilder } from 'hooks/queryBuilder/useQueryBuilder';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { GlobalReducer } from 'types/reducer/globalTime';

import { Container } from './styles';

function TableView(): JSX.Element {
	const { stagedQuery, panelType } = useQueryBuilder();

	const { selectedTime: globalSelectedTime, maxTime, minTime } = useSelector<
		AppState,
		GlobalReducer
	>((state) => state.globalTime);

	const { data, isLoading } = useGetQueryRange(
		{
			query: stagedQuery || initialQueriesMap.traces,
			graphType: panelType || PANEL_TYPES.TABLE,
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
			],
			enabled: !!stagedQuery && panelType === PANEL_TYPES.TABLE,
		},
	);

	return (
		<Container>
			<QueryTable
				query={stagedQuery || initialQueriesMap.traces}
				queryTableData={data?.payload.data.newResult.data.result || []}
				loading={isLoading}
			/>
		</Container>
	);
}

export default memo(TableView);

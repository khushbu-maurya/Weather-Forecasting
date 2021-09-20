import moment from 'moment';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

export interface IChartDataProps {
    Data: any
}

const ChartData = (props: IChartDataProps) => {

    const columns = [{
        selector: 'dt_txt',
        name: 'DateTime',
        cell: d => <span> {moment(d.dt_txt).format('MMMM Do YYYY, h:mm a')} </span>
    }, {
        selector: 'main.temp_min',
        name: 'Max Temp'
    }, {
        selector: 'main.temp_max',
        name: 'Min Temp'
    }, {
        selector: 'wind.speed',
        name: 'Weather',
        cell: d => {
            const src = "https://openweathermap.org/img/wn/" + d.weather[0].icon + ".png"
            return (<img src={src}></img>)
        }
    }, {
        selector: 'wind.speed',
        name: 'Wind'
    }];

    const data = props.Data.list;
    const tableData = {
        columns,
        data
    };
    return (
        <>
            <DataTableExtensions exportHeaders={true} {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    defaultSortAsc={false}
                    pagination
                    paginationPerPage={5}
                    highlightOnHover
                    paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                />
            </DataTableExtensions>
        </>
    )
}

export default ChartData;
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as Highcharts from 'highcharts';
import moment from 'moment';
import { Col, Row, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts//modules/windbarb')(Highcharts);


const Meteogram = (props: any) => {

    const [highRainValue, setHighRainValue] = useState(0);
    const [highRainDate, setHighRainDate] = useState("");
    const [highSnowValue, setHighSnowValue] = useState(0);
    const [highSnowDate, setHighSnowDate] = useState("");

    const formatWeatherData = () => {
        const tempPropsData = props.weather.weatherData;
        let tempWeatherData: any = {};
        tempWeatherData['cityName'] = tempPropsData.city.name + ',' + tempPropsData.city.country + '';

        let tempTemperature: any = [];
        let tempSymbols: any = [];
        let tempPressures: any = [];
        let tempWinds: any = [];

        let bestDayCount: any = [];

        let highRain: string = "";
        let highRainV: number = 0;
        let highSnow: string = "";
        let highSnowV: number = 0;

        tempPropsData.list.map((obj: any, index: number) => {
            tempSymbols.push(obj.weather[0].icon)

            var d = new Date(obj.dt_txt);
            var n = d.getTime();
            if (tempTemperature.length > 0) {
                tempTemperature[tempTemperature.length - 1].to = n;
            }

            if (index === 0) {
                var fromD = new Date(tempPropsData.list[index + 1].dt_txt);
                var from = fromD.getTime();
                tempWeatherData.resolution = n - from;
            }

            tempTemperature.push({
                x: n,
                y: parseInt(
                    obj.main.temp,
                    10
                ),
                symbolName: obj.weather[0].description,
                to: n
            })

            tempPressures.push({
                x: n,
                y: parseFloat(obj.main.pressure)
            })

            if (index % 2 === 0) {
                tempWinds.push({
                    x: n,
                    value: parseFloat(obj.wind.speed),
                    direction: parseFloat(obj.wind.deg)
                });
            }

            if (bestDayCount.length > 0) {
                let createNew: Boolean = false;

                bestDayCount.map((object: any) => {
                    if (object.date == moment(obj.dt_txt).format("YYYY-MM-DD")) {
                        object.rain = (object.rain ? object.rain : 0) + (obj.rain ? obj.rain['3h'] : 0);
                        object.snow = (object.snow ? object.snow : 0) + (obj.snow ? obj.snow['3h'] : 0);
                        createNew = false;
                    } else {
                        createNew = true;
                    }
                })
                if (createNew == true) {
                    let tempRainObj: any = {};
                    tempRainObj.rain = obj.rain ? obj.rain['3h'] : 0;
                    tempRainObj.snow = obj.snow ? obj.snow['3h'] : 0;
                    tempRainObj.date = moment(obj.dt_txt).format("YYYY-MM-DD");
                    bestDayCount.push(tempRainObj);
                }
            } else {
                let tempRainObj: any = {};
                tempRainObj.rain = obj.rain ? obj.rain['3h'] : 0;
                tempRainObj.snow = obj.snow ? obj.snow['3h'] : 0;
                tempRainObj.date = moment(obj.dt_txt).format("YYYY-MM-DD");
                bestDayCount.push(tempRainObj);

            }
        })
        console.log("bestDayCount :: ", tempPropsData)
        bestDayCount.map((firstObject: any) => {
            if (highRainV < firstObject.rain && highRain !== firstObject.date) {
                highRain = firstObject.date;
                highRainV = firstObject.rain;
            }
            if (highSnowV < firstObject.snow && highSnow !== firstObject.date) {
                highSnow = firstObject.date;
                highSnowV = firstObject.snow;
            }
        })

        setHighRainValue(highRainV);
        setHighRainDate(highRain.toString());

        setHighSnowValue(highSnowV);
        setHighSnowDate(highSnow.toString());

        tempWeatherData['symbols'] = tempSymbols;
        tempWeatherData['temperature'] = tempTemperature;
        tempWeatherData['pressures'] = tempPressures;
        tempWeatherData['winds'] = tempWinds;

        return tempWeatherData;
    }

    useEffect(() => {
        if (props.weather.weatherData.cod == 200) {
            const finalData = formatWeatherData();

            Highcharts.chart('container', {
                chart: {
                    renderTo: 'container',
                    marginBottom: 70,
                    marginRight: 40,
                    marginTop: 50,
                    plotBorderWidth: 1,
                    height: 400,
                    alignTicks: false,
                    scrollablePlotArea: { minWidth: 720 },
                },
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
                    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
                title: {
                    text: 'Meteogram for ' + finalData['cityName'],
                    align: 'left',
                    style: {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }
                },
                credits: {
                    text: '',
                    href: "",
                    position: { x: -40 }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    headerFormat:
                        '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                        '<b>{point.point.symbolName}</b><br>'
                },
                xAxis: [{
                    type: 'datetime',
                    tickInterval: 3 * 36e5,
                    tickLength: 0,
                    gridLineWidth: 1,
                    gridLineColor: 'rgba(128, 128, 128, 0.1)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    offset: 30,
                    showLastLabel: true,
                    labels: { format: '{value:%H}' },
                    crosshair: true
                }, {
                    linkedTo: 0,
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                        align: 'left',
                        x: 3,
                        y: -5
                    },
                    opposite: true,
                    tickLength: 20,
                    gridLineWidth: 1
                }],
                yAxis: [{
                    title: { text: null },
                    labels: {
                        format: '{value}°',
                        style: { fontSize: '10px' },
                        x: -3
                    },
                    plotLines: [{
                        value: 0,
                        color: '#BBBBBB',
                        width: 1,
                        zIndex: 2
                    }],
                    maxPadding: 0.3,
                    minRange: 8,
                    tickInterval: 1,
                    gridLineColor: 'rgba(128, 128, 128, 0.1)'
                }, {
                    title: { text: null },
                    labels: { enabled: false },
                    gridLineWidth: 0,
                    tickLength: 0,
                    minRange: 10,
                    min: 0
                }, {
                    allowDecimals: false,
                    title: {
                        text: 'hPa',
                        offset: 0,
                        align: 'high',
                        rotation: 0,
                        style: { fontSize: '10px', },
                        textAlign: 'left',
                        x: 3
                    },
                    labels: {
                        style: { fontSize: '8px', },
                        y: 2,
                        x: 3
                    },
                    gridLineWidth: 0,
                    opposite: true,
                    showLastLabel: false
                }],
                legend: { enabled: false },
                plotOptions: {
                    series: { pointPlacement: 'between' }
                },
                series: [{
                    name: 'Temperature',
                    data: finalData.temperature,
                    type: 'spline',
                    marker: {
                        enabled: false,
                        states: { hover: { enabled: true } }
                    },
                    tooltip: { valueSuffix: ' °K' },
                    zIndex: 1,
                    color: '#FF3333',
                    negativeColor: '#48AFE8'
                },
                {
                    name: 'Air pressure',
                    type: 'spline',
                    data: finalData['pressures'],
                    marker: { enabled: false },
                    shadow: false,
                    tooltip: { valueSuffix: ' hPa' },
                    dashStyle: 'ShortDot',
                    yAxis: 2
                },
                {
                    name: 'Wind',
                    type: 'windbarb',
                    id: 'windbarbs',
                    lineWidth: 1.5,
                    data: finalData['winds'],
                    vectorLength: 20,
                    yOffset: -15,
                    tooltip: { valueSuffix: ' m/s' }
                }
                ],

            }, function (chart) {
                drawIcon(chart, finalData);
            });
        } else if (props.weather.weatherData.cod == 404) {
            alert("City Name Not Found");
        } else {
            console.error(props.weather.weatherData);
        }
    }, [props.weather.weatherData])

    const drawIcon = (chart: any, finalData: any) => {
        chart.series[0].data.forEach((point: any, i: any) => {
            if (finalData.resolution > 36e5 || i % 2 === 0) {
                chart.renderer.image(
                    'https://openweathermap.org/img/wn/' + finalData.symbols[i] + '@4x.png',
                    point.plotX + chart.plotLeft - 15,
                    point.plotY + chart.plotTop - 15,
                    30,
                    30
                ).attr({
                    zIndex: 5
                }).add();
            }
        });
    }

    return (
        <>
            <div >
                <Row>
                    <Col md={3}></Col>
                    <Col md={3}>
                        <Card
                            border={highRainDate !== "" ? "info" : "danger"}
                            className="mb-2"
                        >
                            <Card.Header> Best Day for sell umbrella</Card.Header>
                            <Card.Body>
                                <Card.Title className={"text-center"}> <p style={{ fontSize: '2rem' }}><span className="fa fa-umbrella" aria-hidden="true"></span></p> </Card.Title>
                                <Card.Text className={"text-center"}>
                                    <p>{highRainDate !== "" ? highRainDate : "-"}</p>
                                    <p><OverlayTrigger
                                        placement={"right"}
                                        overlay={
                                            <Tooltip >
                                                {highRainDate !== "" ? highRainDate + " Height rainy day in next 5 day's." : "All Day Snow"}
                                            </Tooltip>
                                        }
                                    >
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </OverlayTrigger>
                                    </p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card
                            border={highSnowDate !== "" ? "info" : "danger"}
                            className="mb-2"
                        >
                            <Card.Header> Best Day for sell Jacket</Card.Header>
                            <Card.Body>
                                <Card.Title className={"text-center"}> <p style={{ fontSize: '2rem' }} ><span className="fa fa-user-secret" aria-hidden="true"></span></p> </Card.Title>
                                <Card.Text className={"text-center"}>
                                    <p>{highSnowDate !== "" ? highSnowDate : "-"}</p>
                                    <p>
                                        <OverlayTrigger
                                            placement={"right"}
                                            overlay={
                                                <Tooltip >
                                                    {/* Tooltip on <strong>{"right"}</strong>. */}
                                                    {highSnowDate !== "" ? highSnowDate + " Height snow day in next 5 day's." : "All day rainy"}
                                                </Tooltip>
                                            }
                                        >
                                            <i className="fa fa-info-circle" aria-hidden="true"></i>
                                        </OverlayTrigger>
                                    </p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </div>
            <figure className="highcharts-figure">
                <div id="container" style={{ maxWidth: '100%', minWidth: '380px', height: '620px', margin: '0 auto' }}>
                    <div style={{ marginTop: '100px', textAlign: 'center' }} id="loading">

                    </div>
                </div>
            </figure>
        </>);
}

const mapStateToProps = (state: any) => {
    return {
        weather: state.weather
    };
};

export default connect(mapStateToProps)(Meteogram);
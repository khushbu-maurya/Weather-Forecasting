import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { cityNameChange, searchWeatherByCityName, getDefaultCityName, searchWeatherByCityNameAndState } from '../reducers/weather.reducer';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import Header from '../layout/header';
import { IRootState } from '../reducers';
import Meteogram from './Meteogram';
import ChartData from './table';

const Home = (props: any) => {

    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);

    const cityName = props.match.params.cityName;

    useEffect(() => {
        if (cityName) {
            props.searchWeatherByCityNameAndState(cityName, dispatch);
            props.cityNameChange(cityName, dispatch);
        } else {
            props.getDefaultCityName(dispatch);
        }
    }, [])

    const onSearchWeather = () => {
        window.location.href = '/city/' + props.cityName;
    }

    return (
        <React.Fragment>
            <Header></Header>
            <Container style={{ marginTop: '20px' }}>
                <Row className="container">
                    <Col md={2}>
                        <Form.Label>Enter City Name</Form.Label>
                    </Col>
                    <Col md={7}>
                        <Form.Control
                            onChange={(e) => {
                                props.cityNameChange(e.target.value, dispatch)
                            }}
                            onKeyUp={(e: any) => {
                                if (e.keyCode == 13) {
                                    onSearchWeather()
                                }
                            }}
                            value={props.cityName}
                            placeholder="Enter City Name" />
                    </Col>
                    <Col md={3}>
                        <>
                            <Button id="btnSearchWeather" onClick={() => {
                                onSearchWeather()
                            }} variant="primary" type="button">
                                Search
                            </Button>{' '}
                            <Button id="btnShowdata" onClick={() => setModalShow(true)} variant="primary" type="button">
                                Show Data
                            </Button>
                        </>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <Meteogram />
                    </Col>
                </Row>
            </Container>
            {
                modalShow &&
                (<Modal centered dialogClassName="modal-90w" size="lg" show={modalShow}>
                    <Modal.Header closeButton onClick={() => { setModalShow(false) }}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Next 5 days weather data for {props.cityName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">
                        <Container>
                            <ChartData Data={props.weather} />
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setModalShow(false) }}>Close</Button>
                    </Modal.Footer>
                </Modal>
                )
            }
        </React.Fragment>);
}

const mapStateToProps = (state: IRootState) => ({
    weather: state.weather.weatherData,
    cityName: state.weather.cityName,
    allData: state
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        cityNameChange,
        searchWeatherByCityName,
        getDefaultCityName,
        searchWeatherByCityNameAndState
    }
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
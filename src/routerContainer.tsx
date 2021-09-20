import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./app/component/home";


const Routes = () => {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/city/:cityName" component={Home} />
                    <Route exact path="/:cityName" component={Home} />
                </Switch>
            </Router>
        </div>
    );
};

export default Routes;
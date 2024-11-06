import {
    Route,
    Routes,
  } from 'react-router-dom';
import { AppConfig } from './AppConfig/AppConfig';
import HomePage from './Home/HomePage';
import ConsortiumListPage from './ConsortiumList/ConsortiumListPage';
import ConsortiumDetailsPage from './ConsortiumDetails/ConsortiumDetailsPage';
import ConsortiumCreatePage from './ConsortiumCreate/ConsortiumCreatePage';
import { RunDetails } from './RunDetails/RunDetails';
import { RunList } from './RunList/RunList';
import RunResults from './RunResults/RunResults';
import ComputationListPage from './ComputationList/ComputationListPage';
import AdminPage from './Admin/AdminPage';


export default function AppRoutes() {   
    return (
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route index path="/home" element={<HomePage />} />
            <Route path="/consortiumList" element={<ConsortiumListPage />} />
            <Route path="/consortiumCreate" element={<ConsortiumCreatePage />} />
            <Route path="/consortium/details/:consortiumId" element={<ConsortiumDetailsPage />} />
            <Route path="/run/details/:runId" element={<RunDetails/>} />
            <Route path="/runList" element={<RunList/>} />
            <Route path="/computationList" element={<ComputationListPage></ComputationListPage>} />
            <Route path="/run/results/:consortiumId/:runId" element={<RunResults />} />
            <Route path="/appConfig" element={<AppConfig/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
    )
}
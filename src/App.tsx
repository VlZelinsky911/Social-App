import "./App.css";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home/Home";
import Categories from "./components/Categories/Categories";
import Favorites from "./components/Favorites/Favorites";
import Profile from "./components/Profile/Profile";

function App() {
	return(
	<>
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/favorites" element={<Favorites />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</Router>
	</>
	)
}
export default App;

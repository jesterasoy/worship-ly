import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Search from "../pages/Search";
import SongDetails from "../pages/SongDetails";
import AddChords from "../components/AddChords";
import NotFound from "../pages/NotFound";
import MyLibrary from "../pages/MyLibrary";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/song/:id" element={<SongDetails />} />
                <Route path="/add-chords" element={<AddChords />} />
                <Route path="/mylibrary" element={<MyLibrary />} />
                {/* fallback route */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainPanel from "./MainPanel";
import StatusBar from "./StatusBar";

import CreateNodeModal from "../modals/CreateNodeModal";
import CreateItemModal from "../modals/CreateItemModal";

export default function Layout() {

    return (

        <div className="h-screen flex flex-col bg-zinc-950">

            <Header />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar />

                <MainPanel />

            </div>

            <StatusBar />

            <CreateNodeModal />

            <CreateItemModal />

        </div>

    );

}
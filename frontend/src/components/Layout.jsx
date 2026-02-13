import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Navbar />
            <main className="grow container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
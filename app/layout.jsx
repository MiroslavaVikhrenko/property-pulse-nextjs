import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from '@/context/GlobalContext';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/global.css';
import 'photoswipe/dist/photoswipe.css';

export const metadata ={
    title: 'Property Pulse',
    keywords: 'rental, property, real estate',
    description: 'Find the perfect rental property',
};

// <AuthProvider> => must be outermost provider
// <GlobalProvider> => next after <AuthProvider> so that everything has access to that context provider
const MainLayout = ({children}) => {
    return ( 
    <AuthProvider>
    <GlobalProvider>
    <html>
        <body>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
        </body>
    </html> 
    </GlobalProvider>
    </AuthProvider>
    );
};
 
export default MainLayout;
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation';

const Layout = () => {
    return (
        <Box>
            <Navbar />
            <Box as="main"  >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 
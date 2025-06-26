import React from 'react';
import { Box } from '@chakra-ui/react';
import * as Icons from 'lucide-react';
import { COLORS } from '@utils/designTokens';

const FacilityIcon = ({ iconName, size = 20, boxSize = "40px" }) => {
    const IconComponent = Icons[iconName] || Icons.Package;

    return (
        <Box
            w={boxSize}
            h={boxSize}
            bg="green.50"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={COLORS.primary}
        >
            <IconComponent size={size} />
        </Box>
    );
};

export default FacilityIcon; 
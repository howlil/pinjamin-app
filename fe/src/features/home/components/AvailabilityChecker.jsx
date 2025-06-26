import React, { useState, useEffect } from 'react';
import { HStack, Icon, useDisclosure } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import Card from '@shared/components/Card';
import { DateField, TimeField } from '@shared/components/FormField';
import { PrimaryButton } from '@shared/components/Button';
import { H3 } from '@shared/components/Typography';
import ErrorState from '@shared/components/ErrorState';
import AvailabilityResultModal from './AvailabilityResultModal';

let motion;
try {
    motion = require('framer-motion').motion;
} catch (error) {
    motion = {
        div: ({ children, initial, animate, transition, ...props }) => (
            <div {...props}>{children}</div>
        )
    };
}

const AvailabilityChecker = ({
    availableBuildings = [],
    loading = false,
    error = null,
    onCheckAvailability
}) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [resultData, setResultData] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();


    useEffect(() => {
        if (isSearching && !loading && availableBuildings.length >= 0) {
            const formattedDate = date.split('-').reverse().join('-');

            const resultData = {
                status: 'success',
                message: `Ditemukan ${availableBuildings.length} gedung yang tersedia`,
                data: {
                    availableBuildings: availableBuildings,
                    requestedDateTime: {
                        date: formattedDate,
                        time: time
                    }
                }
            };

            setResultData(resultData);
            onOpen();

            if (availableBuildings.length > 0) {
                toast.success(`Ditemukan ${availableBuildings.length} gedung yang tersedia`);
            } else {
                toast(`Ditemukan ${availableBuildings.length} gedung yang tersedia`);
            }

            setIsSearching(false);
        }
    }, [availableBuildings, loading, isSearching, date, time]);

    const handleCheck = async () => {
        if (!date || !time) {
            toast.error('Silakan pilih tanggal dan waktu terlebih dahulu');
            return;
        }

        if (!onCheckAvailability) {
            toast.error('Fungsi check availability tidak tersedia');
            return;
        }

        try {
            // Format date dan panggil API
            const formattedDate = date.split('-').reverse().join('-');

            // Set flag searching untuk trigger useEffect setelah API selesai
            setIsSearching(true);

            // Panggil API untuk trigger pencarian
            await onCheckAvailability(formattedDate, time);

            // useEffect akan handle update modal setelah availableBuildings berubah

        } catch (error) {
            console.error('Error checking availability:', error);
            setIsSearching(false);
            toast.error('Terjadi kesalahan saat mengecek ketersediaan');
        }
    };

    const handleCloseModal = () => {
        onClose();
        setResultData(null);
    };

    const today = new Date().toISOString().split('T')[0];


    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card
                    variant="transparent"
                    w="100%"
                    maxW="550px"
                    overflow="hidden"
                    spacing={4}
                >
                    <H3 mb={4}>Cek Ruang Rapat</H3>

                    <HStack spacing={4} w="full" paddingBottom={4}>
                        <DateField
                            label="Tanggal"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={today}
                            w="15em"
                            placeholder="dd/mm/yyyy"
                            flex={1}
                        />

                        <TimeField
                            label="Waktu"
                            value={time}
                            w="15em"
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="hh:mm"
                            flex={1}
                        />
                    </HStack>

                    <PrimaryButton
                        onClick={handleCheck}
                        isLoading={loading || isSearching}
                        loadingText="Mencari..."
                        leftIcon={<Icon as={Search} size={16} />}
                        disabled={!date || !time || loading || isSearching}
                        w="100%"
                        mt={2}
                    >
                        Cek Ketersediaan
                    </PrimaryButton>


                    {error && (
                        <ErrorState
                            variant="default"
                            message={error}
                            showRetryButton={false}
                            mt={2}
                        />
                    )}
                </Card>
            </motion.div>

            {/* Availability Result Modal */}
            <AvailabilityResultModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                resultData={resultData}
            />
        </>
    );
};

export default AvailabilityChecker; 
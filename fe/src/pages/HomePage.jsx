import { Box, Container, VStack, Heading, Text, Button, SimpleGrid, Card, CardBody, Icon, HStack, Input, Grid, GridItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Building, Calendar, Clock, Users, MapPin, Wifi } from 'lucide-react';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { AnimatedList } from '@/components/magicui/animated-list';

const HomePage = () => {
    const features = [
        {
            icon: Building,
            title: 'Ruang Berkualitas',
            description: 'Akses ruang pertemuan dengan fasilitas lengkap'
        },
        {
            icon: Calendar,
            title: 'Peminjaman Online',
            description: 'Pesan ruangan dengan mudah secara online'
        },
        {
            icon: Clock,
            title: 'Fleksibel 24/7',
            description: 'Ketersediaan ruangan sepanjang waktu'
        },
        {
            icon: Wifi,
            title: 'Fasilitas Lengkap',
            description: 'WiFi, AC, proyektor, dan fasilitas modern'
        }
    ];

    // Notifications for animated list
    const notifications = [
        { id: 1, text: '🏢 Ruang meeting baru tersedia' },
        { id: 2, text: '⏰ Pengingat: Peminjaman akan berakhir' },
        { id: 3, text: '🎉 Promo diskon ruang seminar' },
        { id: 4, text: '📋 Fasilitas ruangan diperbarui' },
        { id: 5, text: '👥 Kapasitas ruang ditingkatkan' },
    ];

    return (
        <Box position="relative" minH="100vh">
            {/* Hero Section with Animated Background */}
            <Box
                position="relative"
                bgGradient="linear(135deg, rgba(116, 156, 115, 0.1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(116, 156, 115, 0.05) 100%)"
                pt={20}
                pb={16}
                overflow="hidden"
                backdropFilter="blur(10px)"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.08}
                    duration={3}
                    repeatDelay={1}
                    className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
                />

                <Container maxW="7xl" position="relative" zIndex={1}>
                    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
                        {/* Left Content */}
                        <GridItem>
                            <VStack spacing={8} textAlign="left" alignItems="start">
                                <Heading
                                    size="2xl"
                                    color="#444444"
                                    fontWeight="bold"
                                    lineHeight="shorter"
                                >
                                    Temukan & Sewa Gedung
                                    <Text as="span" color="#749C73"> Ideal untuk Acara Anda</Text>
                                </Heading>
                                <Text fontSize="lg" color="#444444" opacity={0.8}>
                                    Mudah, Cepat, dan Praktis – Peminjaman Gedung Universitas Andalas
                                </Text>

                                {/* Room Search Form - Glamorphism Glass Effect */}
                                <Box
                                    bg="rgba(255, 255, 255, 0.25)"
                                    backdropFilter="blur(20px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    p={8}
                                    borderRadius="20px"
                                    boxShadow="0 8px 32px rgba(116, 156, 115, 0.2)"
                                    w="full"
                                    maxW="md"
                                    position="relative"
                                    _before={{
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        borderRadius: '20px',
                                        padding: '1px',
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(116, 156, 115, 0.1))',
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        zIndex: -1
                                    }}
                                >
                                    <VStack spacing={6} align="stretch">
                                        <Heading size="md" color="#444444" fontWeight="600">
                                            Cek Ruang Rapat
                                        </Heading>

                                        <VStack spacing={4} align="stretch">
                                            <Box>
                                                <Text fontSize="sm" color="#444444" mb={2} fontWeight="500">
                                                    Tanggal
                                                </Text>
                                                <Input
                                                    type="date"
                                                    placeholder="mm/dd/yy"
                                                    bg="rgba(255, 255, 255, 0.4)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                                    borderRadius="full"
                                                    color="#444444"
                                                    _placeholder={{ color: "#444444", opacity: 0.6 }}
                                                    _focus={{
                                                        borderColor: "#749C73",
                                                        boxShadow: "0 0 0 3px rgba(116, 156, 115, 0.1)"
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Text fontSize="sm" color="#444444" mb={2} fontWeight="500">
                                                    Waktu
                                                </Text>
                                                <Input
                                                    type="time"
                                                    placeholder="hr/mn"
                                                    bg="rgba(255, 255, 255, 0.4)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                                    borderRadius="full"
                                                    color="#444444"
                                                    _placeholder={{ color: "#444444", opacity: 0.6 }}
                                                    _focus={{
                                                        borderColor: "#749C73",
                                                        boxShadow: "0 0 0 3px rgba(116, 156, 115, 0.1)"
                                                    }}
                                                />
                                            </Box>
                                        </VStack>

                                        <Button
                                            bg="#749C73"
                                            color="white"
                                            size="lg"
                                            w="full"
                                            borderRadius="full"
                                            boxShadow="0 4px 20px rgba(116, 156, 115, 0.4)"
                                            _hover={{
                                                bg: "#749C73",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 25px rgba(116, 156, 115, 0.5)"
                                            }}
                                            transition="all 0.3s ease"
                                        >
                                            Cek Ketersediaan
                                        </Button>
                                    </VStack>
                                </Box>
                            </VStack>
                        </GridItem>

                        {/* Right Content - Status */}
                        <GridItem>
                            <VStack spacing={6}>
                                {/* Status Card - Glamorphism Glass Effect */}
                                <Box
                                    bg="rgba(255, 255, 255, 0.25)"
                                    backdropFilter="blur(20px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    p={8}
                                    borderRadius="20px"
                                    boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                                    w="full"
                                    textAlign="center"
                                    position="relative"
                                    _before={{
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        borderRadius: '20px',
                                        padding: '1px',
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(116, 156, 115, 0.1))',
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        zIndex: -1
                                    }}
                                >
                                    <VStack spacing={4}>
                                        <Heading size="lg" color="#444444" fontWeight="600">
                                            Tidak peminjaman ruangan hari ini
                                        </Heading>
                                        <Text color="#444444" fontSize="md" opacity={0.8}>
                                            Saat ini semua ruangan sedang kosong.<br />
                                            Silakan lakukan Peminjaman.
                                        </Text>
                                    </VStack>
                                </Box>

                                {/* Animated Notifications List */}
                                <Box className="h-[200px] w-full">
                                    <AnimatedList delay={2500}>
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="flex items-center gap-3 p-4 mb-3"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    backdropFilter: 'blur(15px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '20px',
                                                    boxShadow: '0 4px 20px rgba(116, 156, 115, 0.1)'
                                                }}
                                            >
                                                <span className="text-sm" style={{ color: '#444444' }}>
                                                    {notification.text}
                                                </span>
                                            </div>
                                        ))}
                                    </AnimatedList>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box py={16} position="relative" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(10px)">
                <Container maxW="7xl">
                    <VStack spacing={12}>
                        <VStack spacing={4} textAlign="center">
                            <Heading size="xl" color="#444444" fontWeight="bold">
                                Keunggulan Layanan Kami
                            </Heading>
                            <Text color="#444444" fontSize="lg" opacity={0.8}>
                                Nikmati kemudahan peminjaman ruangan dengan fasilitas terbaik
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                            {features.map((feature, index) => (
                                <Box
                                    key={index}
                                    bg="rgba(255, 255, 255, 0.25)"
                                    backdropFilter="blur(20px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    borderRadius="20px"
                                    boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                                    p={6}
                                    transition="all 0.3s ease"
                                    _hover={{
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)"
                                    }}
                                    position="relative"
                                    _before={{
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        borderRadius: '20px',
                                        padding: '1px',
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(116, 156, 115, 0.1))',
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        zIndex: -1
                                    }}
                                >
                                    <VStack spacing={4}>
                                        <Icon
                                            as={feature.icon}
                                            w={12}
                                            h={12}
                                            color="#749C73"
                                        />
                                        <Text fontWeight="bold" fontSize="lg" color="#444444">
                                            {feature.title}
                                        </Text>
                                        <Text color="#444444" textAlign="center" opacity={0.8}>
                                            {feature.description}
                                        </Text>
                                    </VStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage; 
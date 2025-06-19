import { useState } from 'react';
import {
    Box,
    Container,
    Flex,
    VStack,
    HStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    IconButton,
    Link,
    Image,
    Heading,
    useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../utils/store';
import logoUnand from '../assets/logo.png';
import campusImage from '../assets/gambar.svg';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate login API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock user data - in real app, this would come from API
            const userData = {
                id: 1,
                email: formData.email,
                name: 'User Test',
                userType: 'mahasiswa'
            };
            const token = 'mock-jwt-token';

            // Login using auth store
            login(userData, token);

            toast({
                title: "Login berhasil!",
                description: "Selamat datang kembali",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: "Login gagal",
                description: "Email atau password salah",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bgGradient="linear(135deg, rgba(116, 156, 115, 0.1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(116, 156, 115, 0.05) 100%)"
        >
            <Container maxW="7xl" p={0}>
                <Flex minH="100vh">
                    {/* Left Side - Login Form */}
                    <Box
                        flex={1}
                        bg="rgba(255, 255, 255, 0.25)"
                        backdropFilter="blur(20px)"
                        p={{ base: 6, md: 12, lg: 16 }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <VStack spacing={8} w="full" maxW="md">
                            {/* Logo */}
                            <VStack spacing={4}>
                                <Image
                                    src={logoUnand}
                                    alt="Universitas Andalas"
                                    h="80px"
                                    w="auto"
                                />
                                <VStack spacing={2}>
                                    <Heading
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color="#444444"
                                    >
                                        Masuk
                                    </Heading>
                                    <Text
                                        fontSize="sm"
                                        color="#444444"
                                        opacity={0.8}
                                        textAlign="center"
                                    >
                                        Masukkan email dan kata sandi Anda untuk masuk!
                                    </Text>
                                </VStack>
                            </VStack>

                            {/* Login Form - Glass Card */}
                            <Box
                                w="full"
                                bg="rgba(255, 255, 255, 0.3)"
                                backdropFilter="blur(20px)"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                borderRadius="20px"
                                boxShadow="0 8px 32px rgba(116, 156, 115, 0.2)"
                                p={8}
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
                                <form onSubmit={handleSubmit}>
                                    <VStack spacing={6}>
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" fontWeight="medium" color="#444444">
                                                Email<Text as="span" color="#749C73">*</Text>
                                            </FormLabel>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="mail@simmmple.com"
                                                bg="rgba(255, 255, 255, 0.4)"
                                                backdropFilter="blur(10px)"
                                                border="1px solid rgba(255, 255, 255, 0.3)"
                                                borderRadius="full"
                                                color="#444444"
                                                fontSize="sm"
                                                _placeholder={{ color: "#444444", opacity: 0.6 }}
                                                _focus={{
                                                    borderColor: '#749C73',
                                                    boxShadow: '0 0 0 3px rgba(116, 156, 115, 0.1)'
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" fontWeight="medium" color="#444444">
                                                Password<Text as="span" color="#749C73">*</Text>
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Min. 8 characters"
                                                    bg="rgba(255, 255, 255, 0.4)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                                    borderRadius="full"
                                                    color="#444444"
                                                    fontSize="sm"
                                                    _placeholder={{ color: "#444444", opacity: 0.6 }}
                                                    _focus={{
                                                        borderColor: '#749C73',
                                                        boxShadow: '0 0 0 3px rgba(116, 156, 115, 0.1)'
                                                    }}
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        bg="transparent"
                                                        color="#444444"
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        size="sm"
                                                        _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>

                                        <HStack justify="flex-end" w="full">
                                            <Link
                                                as={RouterLink}
                                                to="/forgot-password"
                                                fontSize="sm"
                                                color="#749C73"
                                                _hover={{ textDecoration: 'underline' }}
                                            >
                                                Lupa password?
                                            </Link>
                                        </HStack>

                                        <Button
                                            type="submit"
                                            w="full"
                                            bg="#749C73"
                                            color="white"
                                            borderRadius="full"
                                            boxShadow="0 4px 20px rgba(116, 156, 115, 0.4)"
                                            _hover={{
                                                bg: "#749C73",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 25px rgba(116, 156, 115, 0.5)"
                                            }}
                                            isLoading={isLoading}
                                            loadingText="Masuk..."
                                            fontWeight="medium"
                                            py={6}
                                            transition="all 0.3s ease"
                                        >
                                            Masuk
                                        </Button>
                                    </VStack>
                                </form>

                                {/* Register Link */}
                                <HStack justify="center" mt={6}>
                                    <Text fontSize="sm" color="#444444" opacity={0.8}>
                                        belum punya akun ?
                                    </Text>
                                    <Link
                                        as={RouterLink}
                                        to="/register"
                                        fontSize="sm"
                                        color="#749C73"
                                        fontWeight="medium"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        daftar
                                    </Link>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Right Side - Campus Image with Glass Overlay */}
                    <Box
                        flex={1}
                        display={{ base: 'none', lg: 'block' }}
                        position="relative"
                        overflow="hidden"
                    >
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgImage={`url(${campusImage})`}
                            bgSize="cover"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                        />
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="rgba(116, 156, 115, 0.3)"
                            backdropFilter="blur(2px)"
                        />

                        {/* Glass Info Card */}
                        <Box
                            position="absolute"
                            bottom={8}
                            left={8}
                            right={8}
                            bg="rgba(255, 255, 255, 0.25)"
                            backdropFilter="blur(20px)"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            borderRadius="20px"
                            boxShadow="0 8px 32px rgba(116, 156, 115, 0.2)"
                            p={6}
                        >
                            <VStack spacing={3} textAlign="center">
                                <Heading size="md" color="white">
                                    Sistem Peminjaman Gedung
                                </Heading>
                                <Text fontSize="sm" color="white" opacity={0.9}>
                                    Universitas Andalas - Mudah, Cepat, dan Praktis
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box >
    );
};

export default LoginPage;

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
    useColorModeValue,
    Image,
    Heading,
    useToast,
    Select
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoUnand from '../assets/logo.png';
import campusImage from '../assets/gambar.svg';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        userType: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const inputBg = useColorModeValue('gray.50', 'gray.700');

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
            // Simulate register API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Pendaftaran berhasil!",
                description: "Akun Anda telah dibuat. Silakan login.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Redirect to login
            navigate('/login');
        } catch (error) {
            toast({
                title: "Pendaftaran gagal",
                description: "Terjadi kesalahan saat mendaftar",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Flex minH="100vh">
                {/* Left Side - Register Form */}
                <Box
                    flex={1}
                    bg={bgColor}
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
                                    color={useColorModeValue('gray.800', 'white')}
                                >
                                    Daftar
                                </Heading>
                                <Text
                                    fontSize="sm"
                                    color={textColor}
                                    textAlign="center"
                                >
                                    Masukkan data pribadi Anda untuk mendaftar!
                                </Text>
                            </VStack>
                        </VStack>

                        {/* Register Form */}
                        <Box w="full">
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm" fontWeight="medium">
                                            Nama Lengkap<Text as="span" color="red.500">*</Text>
                                        </FormLabel>
                                        <Input
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="john doe"
                                            bg={inputBg}
                                            border="1px"
                                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                                            fontSize="sm"
                                            _focus={{
                                                borderColor: 'green.400',
                                                boxShadow: '0 0 0 1px #48BB78'
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm" fontWeight="medium">
                                            Tipe Peninjam<Text as="span" color="red.500">*</Text>
                                        </FormLabel>
                                        <Select
                                            name="userType"
                                            value={formData.userType}
                                            onChange={handleInputChange}
                                            placeholder="Civitas Akademika Unand"
                                            bg={inputBg}
                                            border="1px"
                                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                                            fontSize="sm"
                                            _focus={{
                                                borderColor: 'green.400',
                                                boxShadow: '0 0 0 1px #48BB78'
                                            }}
                                        >
                                            <option value="mahasiswa">Mahasiswa</option>
                                            <option value="dosen">Dosen</option>
                                            <option value="staff">Staff</option>
                                            <option value="masyarakat">Masyarakat Umum</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm" fontWeight="medium">
                                            Email<Text as="span" color="red.500">*</Text>
                                        </FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="jhon.doe@email.com"
                                            bg={inputBg}
                                            border="1px"
                                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                                            fontSize="sm"
                                            _focus={{
                                                borderColor: 'green.400',
                                                boxShadow: '0 0 0 1px #48BB78'
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm" fontWeight="medium">
                                            Password<Text as="span" color="red.500">*</Text>
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Min. 8 characters"
                                                bg={inputBg}
                                                border="1px"
                                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                                                fontSize="sm"
                                                _focus={{
                                                    borderColor: 'green.400',
                                                    boxShadow: '0 0 0 1px #48BB78'
                                                }}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    size="sm"
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        w="full"
                                        bg="green.400"
                                        color="white"
                                        _hover={{ bg: 'green.500' }}
                                        _active={{ bg: 'green.600' }}
                                        isLoading={isLoading}
                                        loadingText="Daftar..."
                                        fontWeight="medium"
                                        py={6}
                                        mt={4}
                                    >
                                        Daftar
                                    </Button>
                                </VStack>
                            </form>

                            {/* Login Link */}
                            <HStack justify="center" mt={6}>
                                <Text fontSize="sm" color={textColor}>
                                    sudah punya akun ?
                                </Text>
                                <Link
                                    as={RouterLink}
                                    to="/login"
                                    fontSize="sm"
                                    color="green.500"
                                    fontWeight="medium"
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    masuk
                                </Link>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Right Side - Campus Image */}
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
                        bg="blackAlpha.300"
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default RegisterPage; 
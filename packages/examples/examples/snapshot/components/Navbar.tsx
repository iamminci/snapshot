/* eslint-disable import/order */
import Link from 'next/link';
import styles from '@styles/Navbar.module.css';
import { Button, HStack, Image, Spinner } from '@chakra-ui/react';
// import { abridgeAddress } from '@utils/helpers';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  //   const [isHover, setIsHover] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="marble Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
      <ConnectButton />
      {/* {address && (
        <Button
          className={styles.addressButton}
          onClick={handleDisconnect}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {isLoading ? (
            <Spinner color="white" />
          ) : isHover ? (
            'Disconnect'
          ) : (
            abridgeAddress(address)
          )}
        </Button>
      )} */}
    </HStack>
  );
};

export default Navbar;

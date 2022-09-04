/* eslint-disable no-shadow */
/* eslint-disable import/order */
import styles from '@styles/Landing.module.css';
import { VStack, Text } from '@chakra-ui/react';
// import withTransition from '@components/withTransition';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Landing = () => {
  const { address } = useAccount();

  return (
    <VStack>
      <Text className={styles.title}>Welcome to Snapshot</Text>
      <Text className={styles.subtitle}>
        Connect your wallet to get started
      </Text>
      <ConnectButton />
    </VStack>
  );
};

// export default withTransition(Landing);
export default Landing;

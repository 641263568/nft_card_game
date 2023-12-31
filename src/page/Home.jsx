import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    if (playerName !== "") {
      try {
        const playerExist = await contract.isPlayer(walletAddress);
        if (!playerExist) {
          await contract.registerPlayer(playerName, playerName);
          setShowAlert({
            status: true,
            type: "info",
            message: `${playerName} is being summoned`,
          });
        }
      } catch (err) {
        setShowAlert({
          status: true,
          type: "failure",
          message: "something went wrong",
        });
      }
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) createPlayerToken();
  }, [contract]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing
    <br /> the ultimate Web3 Battle Card Game
  </>
);

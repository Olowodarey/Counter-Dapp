"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { wagmiContractConfig } from "./contract";
import LoadingSpinner from "./component/Loading";

export default function Home() {
  const [inputValue, setInputValue] = useState<number>(0);
  const { address, isConnected } = useAccount();
  const [activeOperation, setActiveOperation] = useState<
    "increase" | "decrease" | "reset" | null
  >(null);

  const { data: count, refetch } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getCount",
    args: [],
    query: {
      enabled: !!address,
    },
  });

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isPendingWrite,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Reset active operation when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setActiveOperation(null);
      refetch();
      resetWrite();
    }
  }, [isConfirmed, refetch, resetWrite]);

  const isLoading = isPendingWrite || isConfirming;

  // handle increment
  const handleIncrement = async () => {
    if (isLoading || activeOperation) return;

    setActiveOperation("increase");
    try {
      const functionName = inputValue > 0 ? "increaseByValue" : "increaseByOne";
      const args: readonly [bigint] | readonly [] = inputValue > 0 ? [BigInt(inputValue)] : [];

      await writeContract({
        ...wagmiContractConfig,
        functionName,
        args,
      });
    } catch (error) {
      console.error("Error incrementing count:", error);
      setActiveOperation(null);
    }
  };

  // handle decrease
  const handleDecrement = async () => {
    if (isLoading || activeOperation) return;

    setActiveOperation("decrease");
    try {
      const functionName = inputValue > 0 ? "decreaseByValue" : "decreaseByOne";
      const args: readonly [bigint] | readonly [] = inputValue > 0 ? [BigInt(inputValue)] : [];

      await writeContract({
        ...wagmiContractConfig,
        functionName,
        args,
      });
    } catch (error) {
      console.error("Error decrementing count:", error);
      setActiveOperation(null);
    }
  };

  // handle reset
  const handleReset = async () => {
    if (isLoading || activeOperation) return;

    setActiveOperation("reset");
    try {
      await writeContract({
        ...wagmiContractConfig,
        functionName: "resetCount",
        args: [],
      });
    } catch (error) {
      console.error("Error calling reset:", error);
      setActiveOperation(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(e.target.value));
  };

  // check the button state
  const getButtonState = (operation: "increase" | "decrease" | "reset") => {
    const isActive = activeOperation === operation;
    const isDisabled = !!activeOperation || isLoading;

    let baseColors = {
      increase: "bg-green-500 hover:bg-blue-400",
      decrease: "bg-red-500 hover:bg-blue-400",
      reset: "bg-yellow-500 hover:bg-blue-400",
    };

    const colorClass =
      isActive || isDisabled ? "bg-gray-400" : baseColors[operation];

    return {
      disabled: isDisabled,
      className: `px-4 py-2 ${colorClass} text-black rounded-2xl transition-colors text-base w-[200px] flex items-center justify-center`,
      showSpinner: isActive && (isPendingWrite || isConfirming),
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-700 flex flex-col items-center justify-center px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        <div className="flex flex-col items-center">
          <div className="bg-purple-700 p-6 md:p-10 w-[120px] md:w-[150px] text-center rounded-full">
            <h1 className="text-4xl md:text-6xl font-bold">
              {count?.toString() || "0"}
            </h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 w-full max-w-3xl justify-center items-center">
          <button
            onClick={handleIncrement}
            {...getButtonState("increase")}
            className={`${
              getButtonState("increase").className
            } w-full sm:w-[200px] text-sm md:text-base`}
          >
            {getButtonState("increase").showSpinner ? (
              <LoadingSpinner />
            ) : inputValue > 0 ? (
              `Increase by ${inputValue}`
            ) : (
              "Increase by 1"
            )}
          </button>

          <input
            type="number"
            value={inputValue || ""}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter value"
            className="text-black p-3 md:p-4 border-2 border-blue-500 rounded-lg w-full sm:w-[150px] text-center"
            disabled={!!activeOperation || isLoading}
          />

          <button
            onClick={handleDecrement}
            {...getButtonState("decrease")}
            className={`${
              getButtonState("decrease").className
            } w-full sm:w-[200px] text-sm md:text-base`}
          >
            {getButtonState("decrease").showSpinner ? (
              <LoadingSpinner />
            ) : inputValue > 0 ? (
              `Decrease by ${inputValue}`
            ) : (
              "Decrease by 1"
            )}
          </button>
        </div>

        <div className="mt-4 md:mt-8">
          <button
            onClick={handleReset}
            {...getButtonState("reset")}
            className={`${
              getButtonState("reset").className
            } w-[200px] text-sm md:text-base`}
          >
            {getButtonState("reset").showSpinner ? (
              <LoadingSpinner />
            ) : (
              "Reset Count"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

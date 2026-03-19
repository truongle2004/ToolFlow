"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWheel } from "../hooks/useWheel";
import { WheelInput } from "./WheelInput";
import { WheelDisplay } from "./WheelDisplay";

export function WheelContainer() {
  const {
    state: { items, isSpinning, rotation, winner },
    addItem,
    removeItem,
    clearItems,
    spin,
    clearWinner,
    config,
  } = useWheel({ spinDuration: 6000, minSpins: 6 });

  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);

  useEffect(() => {
    if (winner && !isSpinning) {
      setWinnerDialogOpen(true);
    }
  }, [winner, isSpinning]);

  const handleCloseDialog = () => {
    setWinnerDialogOpen(false);
    clearWinner();
  };

  const handleRemoveWinnerAndClose = () => {
    if (winner) {
      removeItem(winner.id);
    }
    handleCloseDialog();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full min-h-[600px] w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="md:col-span-8 flex flex-col items-center justify-center bg-card rounded-xl border shadow-sm p-4 md:p-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Wheel of Names
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Add names and spin the wheel to select a random winner. Perfect for
          raffles, giveaways, and decision making.
        </p>

        <WheelDisplay
          items={items}
          rotation={rotation}
          isSpinning={isSpinning}
          onSpin={spin}
          duration={config.spinDuration}
        />

        <div className="mt-8">
          <Button
            size="lg"
            className="w-48 text-lg py-6 shadow-md rounded-full"
            onClick={spin}
            disabled={isSpinning || items.length === 0}
          >
            {isSpinning ? "Spinning..." : "SPIN IT!"}
          </Button>
        </div>
      </div>

      <div className="md:col-span-4 h-[600px] md:h-auto">
        <WheelInput
          items={items}
          onAdd={addItem}
          onRemove={removeItem}
          onClear={clearItems}
          disabled={isSpinning}
        />
      </div>

      <Dialog open={winnerDialogOpen} onOpenChange={setWinnerDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-2xl font-bold mb-2">
              We have a winner!
            </DialogTitle>
            <DialogDescription>The wheel has spoken.</DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl text-primary drop-shadow-sm">🥳</div>
            <h2
              className="text-4xl font-extrabold text-center px-4 py-2 rounded-lg"
              style={{
                color: winner?.color,
                backgroundColor: `${winner?.color}11`,
              }}
            >
              {winner?.name}
            </h2>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={handleRemoveWinnerAndClose}
              className="flex-1"
            >
              Remove & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

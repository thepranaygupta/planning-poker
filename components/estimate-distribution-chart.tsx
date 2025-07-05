"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Estimate } from "@/lib/supabase";

interface EstimateDistributionChartProps {
  estimates: Estimate[];
  cardsRevealed: boolean;
}

export default function EstimateDistributionChart({
  estimates,
  cardsRevealed,
}: EstimateDistributionChartProps) {
  if (!cardsRevealed || estimates.length === 0) {
    return null;
  }

  // Get all estimates and count occurrences
  const estimateValues = estimates.filter((e) => e.estimate).map((e) => e.estimate!);
  const estimateCounts = estimateValues.reduce((acc, estimate) => {
    acc[estimate] = (acc[estimate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort
  const distributionData = Object.entries(estimateCounts)
    .map(([estimate, count]) => ({ estimate, count }))
    .sort((a, b) => {
      // Sort numerically if both are numbers, otherwise alphabetically
      const aNum = Number.parseFloat(a.estimate);
      const bNum = Number.parseFloat(b.estimate);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.estimate.localeCompare(b.estimate);
    });

  if (distributionData.length === 0) {
    return null;
  }

  const maxCount = Math.max(...distributionData.map((d) => d.count));
  const totalEstimates = estimateValues.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Estimate Distribution</h3>
        <p className="text-sm text-gray-600">
          {totalEstimates} total estimate{totalEstimates !== 1 ? "s" : ""} across{" "}
          {distributionData.length} unique value
          {distributionData.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {distributionData.map(({ estimate, count }, index) => {
          const isHighest = count === maxCount;
          const percentage = (count / maxCount) * 100;

          return (
            <motion.div
              key={estimate}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-center space-x-3">
              {/* Estimate Label */}
              <div className="w-12 flex-shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-md border-2 flex items-center justify-center text-sm font-bold",
                    isHighest
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  )}>
                  {estimate}
                </div>
              </div>

              {/* Bar Container */}
              <div className="flex-1 relative">
                {/* Percentage indicator */}
                <div className="absolute right-2 z-10 top-0 h-8 flex items-center">
                  <span className={`text-xs font-medium ${isHighest ? "text-white" : "text-gray-500"}`}>
                    {Math.round((count / totalEstimates) * 100)}%
                  </span>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + 0.1 * index, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-lg relative",
                      isHighest
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-blue-400 to-blue-500"
                    )}></motion.div>

                  {/* Count Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        percentage > 30 ? "text-white" : "text-gray-700"
                      )}>
                      {count} vote{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Highest indicator */}
              {/* {isHighest && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + 0.1 * index }}
                  className="flex-shrink-0">
                  <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-300">
                    Most Popular
                  </div>
                </motion.div>
              )} */}
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{distributionData.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Unique Values</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalEstimates}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Votes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{maxCount}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Highest Count</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((maxCount / totalEstimates) * 100)}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Consensus</div>
          </div>
        </div>
      </motion.div>

      {/* Consensus indicator */}
      {maxCount / totalEstimates >= 0.6 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Strong consensus reached! {Math.round((maxCount / totalEstimates) * 100)}% agreement
            </span>
          </div>
        </motion.div>
      )}

      {maxCount / totalEstimates < 0.4 && distributionData.length > 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-800">
              Wide spread in estimates - consider discussion before next round
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

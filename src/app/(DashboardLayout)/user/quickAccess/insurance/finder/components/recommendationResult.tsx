"use client";

import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";

type RecommendationResultProps = {
  result: {
    topProvider: string;
    recommendation: string;
    reasoning: string;
    tips: string[];
  };
  petName: string;
  onTryAgain: () => void;
};

export const RecommendationResult = ({
  result,
  petName,
  onTryAgain,
}: RecommendationResultProps) => {
  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-br from-[#4682B4]/10 to-[#00E5CC]/5 dark:from-[#4682B4]/20 dark:to-[#00E5CC]/10 border border-[#4682B4]/30 shadow-sm">
        <CardBody className="p-5">
          <span className="text-[#4682B4] dark:text-[#B8FF2E] text-[10px] font-bold uppercase tracking-wider">
            AI Recommendation
          </span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            🏆 {result.topProvider}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-xs mt-2 leading-relaxed">
            {result.recommendation}
          </p>
          <div className="mt-3 bg-gray-100 dark:bg-white/5 rounded-md p-3">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              Why this provider?
            </p>
            <p className="text-gray-700 dark:text-gray-200 text-xs leading-relaxed">
              {result.reasoning}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <CardBody className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
            💡 Tips for {petName}
          </h3>
          <ul className="space-y-1.5">
            {result.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300"
              >
                <span className="text-[#4682B4] dark:text-[#B8FF2E] flex-shrink-0">
                  ✓
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/user/quickAccess/insurance" className="flex-1">
          <Button className="w-full bg-[#4682B4] dark:bg-[#B8FF2E] text-white dark:text-black font-bold text-sm py-2.5 rounded-md">
            Compare All Plans →
          </Button>
        </Link>
        <Button
          onPress={onTryAgain}
          variant="bordered"
          className="flex-1 border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 text-sm py-2.5 rounded-md"
        >
          Try Another Pet
        </Button>
      </div>
    </div>
  );
};

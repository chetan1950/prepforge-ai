import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const bank = [
["Percentages","A jacket priced at ₹1,200 is discounted by 15%. What is the sale price?",["₹980","₹1,020","₹1,050","₹1,080"],"₹1,020","15% of 1,200 is 180; subtracting gives ₹1,020."],
["Time & Work","A can finish a task in 12 days and B in 18 days. How long working together?",["6 days","7.2 days","8 days","9 days"],"7.2 days","Combined rate is 1/12 + 1/18 = 5/36 task per day, so time is 36/5 days."],
["Ratio & Proportion","The ratio of two quantities is 3:5 and their sum is 64. What is the smaller quantity?",["20","24","32","40"],"24","There are 8 equal parts; each is 8. The smaller value is 3 × 8."],
["Number System","What is the least positive number divisible by both 12 and 18?",["24","30","36","72"],"36","The least common multiple of 12 and 18 is 36."],
["Average","The average of 5 numbers is 18. If 26 is added, what is the new average?",["18","19","19⅓","20"],"19⅓","The original sum is 90. The new average is (90 + 26) / 6 = 19⅓."],
["Time, Speed & Distance","A train covers 180 km in 3 hours. At the same speed, how far in 2.5 hours?",["120 km","135 km","150 km","165 km"],"150 km","The speed is 60 km/h, so in 2.5 hours it covers 150 km."],
["Profit & Loss","An item bought for ₹800 is sold for ₹920. What is the profit percentage?",["12%","15%","18%","20%"],"15%","Profit is ₹120; 120/800 × 100 = 15%."],
["Simple Interest","Find simple interest on ₹5,000 at 8% per year for 2 years.",["₹600","₹700","₹800","₹900"],"₹800","SI = principal × rate × time / 100."],
["Probability","A fair six-sided die is rolled. What is the probability of an even result?",["1/6","1/3","1/2","2/3"],"1/2","There are three even faces out of six equally likely faces."],
["Coding-Decoding","If each letter is shifted one position forward, how is CODE written?",["DPEF","BNCD","DPDF","EQFG"],"DPEF","Shift each character forward one position."],
["Direction Sense","Mira walks 4 km north, then 3 km east. How far is she from her start?",["5 km","6 km","7 km","1 km"],"5 km","The route forms a 3-4-5 right triangle."],
["Series","What number comes next: 3, 7, 15, 31, …?",["47","55","63","65"],"63","Each term is doubled and one added."],
["Grammar","Choose the grammatically correct sentence.",["Each of the candidates have arrived.","Each of the candidates has arrived.","Each candidates has arrived.","Each of candidate have arrived."],"Each of the candidates has arrived.","Each is singular and takes the singular verb has."],
["Vocabulary","Choose the closest meaning of 'concise'.",["Brief and clear","Complex","Uncertain","Persuasive"],"Brief and clear","Concise means expressing information clearly in few words."],
["Data Interpretation","A team completed 24 tasks in week one and 30 in week two. What was the percentage increase?",["20%","25%","30%","6%"],"25%","Increase is 6 on a base of 24: 6/24 × 100 = 25%."]
];
const titles=["Two Sum","Reverse a String","Valid Palindrome","Merge Sorted Arrays","Maximum Subarray","First Unique Character","Binary Search","Balanced Brackets","Remove Duplicates","Rotate Array","Find Missing Number","Anagram Check","Reverse Linked List","Detect Cycle","Queue Using Stacks","Tree Height","Level Order Traversal","Graph Reachability","Count Islands","Coin Change","Climbing Stairs","Longest Common Subsequence","Sliding Window Maximum","Merge Intervals","Top K Frequent","Product Except Self","Search Rotated Array","Lowest Common Ancestor","Word Break","Minimum Window Substring"];
async function main(){
 if(!(await db.question.count())) await db.question.createMany({data:Array.from({length:105},(_,i)=>{const entry=bank[i%bank.length] as [string,string,string[],string,string];const [category,prompt,options,answer,explanation]=entry;return {category,prompt:i<bank.length?prompt:`${prompt} (Practice variation ${Math.floor(i/bank.length)+1})`,options:JSON.stringify(options),answer,explanation,difficulty:i%3===0?"Easy":i%3===1?"Medium":"Hard",tags:category.toLowerCase(),timeLimit:60};})});
 if(!(await db.codingProblem.count())) await db.codingProblem.createMany({data:titles.map((title,i)=>({title,category:["Arrays","Strings","Linked Lists","Stack","Searching","Dynamic Programming","Trees","Graphs"][i%8],difficulty:i%3===0?"Easy":i%3===1?"Medium":"Hard",statement:`Implement ${title.toLowerCase()} efficiently. Return the required result for every valid input.`,inputFormat:"Read the input values described in the examples.",outputFormat:"Print the computed result.",constraints:"Input fits in standard integer ranges.",examples:"Consider a representative input and its expected result.",hints:"Consider edge cases, empty input, and expected time complexity."}))});
 console.log(`Seeded ${await db.question.count()} questions and ${await db.codingProblem.count()} problems.`);
}
main().finally(()=>db.$disconnect());

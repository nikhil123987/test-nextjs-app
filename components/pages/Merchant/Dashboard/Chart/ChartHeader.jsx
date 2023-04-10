import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

const ChartHeader = () => {
  return (
    <div>
      <header className="flex justify-between items-center px-2">
        <section>

          <p  className="text-xl font-bold text-slate-700">Total Sales</p>

          <div className="flex items-center gap-3  sm:gap-3">
            <p className="text-xs font-bold text-slate-700 md:text-base">Rs 0</p>{" "}

            <div className="flex items-center  gap-0">
              <AiOutlineArrowUp className="text-xs font-bold text-green/70"/> 
              <p className="text-xs font-bold text-green/70">Rs 0</p>
            </div>

          </div>
        </section>

        {/* <section>
          <div>
            <div className="dropdown inline-block relative">
              <button className="bg-cyan-50 text-cyan-500 py-1 px-3 rounded inline-flex items-center">
                <span className="mr-1">Last Month</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                </svg>
              </button>
              <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                <li className="">
                  <a
                    className="rounded-t bg-cyan-50 text-cyan-500 hover:bg-cyan-100 text-cyan-500 py-2 px-4 block whitespace-no-wrap"
                    href="#"
                  >
                    One Month
                  </a>
                </li>
                <li className="">
                  <a
                    className="bg-cyan-50 text-cyan-500 hover:bg-cyan-100 text-cyan-500 py-2 px-4 block whitespace-no-wrap"
                    href="#"
                  >
                    Current Year
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section> */}


        <div className="select-dropdown">
          <select>
            <option className="option" value="Option 1">Last Month</option>
            <option className="option" value="Option 2">Current Month</option>
          </select>
        </div>

      </header>
    </div>
  );
};

export default ChartHeader;

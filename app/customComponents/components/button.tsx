// import { defaultProps } from "@/app/types";

// export default function Button ({ text, color, size, disabled, ...props }: defaultProps) {
//     let colorClasses = '';
//     switch (color) {
//         case 'primary':
//             colorClasses = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
//             break;
//         case 'secondary':
//             colorClasses = 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400';
//             break;
//         case 'danger':
//             colorClasses = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
//             break;
//         default:
//             colorClasses = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
//     }

//     let sizeClasses = '';
//     switch (size) {
//         case 'small':
//             sizeClasses = 'px-3 py-1 text-sm';
//             break;
//         case 'medium':
//             sizeClasses = 'px-4 py-2 text-base';
//             break;
//         case 'large':
//             sizeClasses = 'px-6 py-3 text-lg';
//             break;
//         default:
//             sizeClasses = 'px-4 py-2 text-base';
//     }

//     const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-md';

//     return (
//         <button
//             className={`
//           ${colorClasses} ${sizeClasses} ${disabledClasses}
//           text-white font-semibold rounded-lg transition duration-150 ease-in-out
//           focus:outline-none focus:ring-4
//         `}
//             disabled={disabled}
//             {...props}
//         >
//             {text}
//         </button>
//     );
// };
  
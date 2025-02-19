'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Jan', value1: 12000, value2: 22000 },
    { name: 'Feb', value1: 18000, value2: 29000 },
    { name: 'Mar', value1: 17000, value2: 12000 },
    { name: 'Apr', value1: 18000, value2: 16000 },
    { name: 'May', value1: 22000, value2: 32000 },
    { name: 'Jun', value1: 38753, value2: 21000 },
    { name: 'Jul', value1: 25000, value2: 24000 },
    { name: 'Aug', value1: 21000, value2: 30000 },
    { name: 'Sept', value1: 19000, value2: 32000 },
    { name: 'Oct', value1: 18000, value2: 17000 },
    { name: 'Nov', value1: 23000, value2: 25000 },
    { name: 'Dec', value1: 24000, value2: 35000 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-sm font-semibold text-primary">
                    ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
        )
    }
    return null
}

export default function Graph() {
    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">Total Revenue</h2>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280' }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value1"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#3B82F6' }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value2"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#EF4444' }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Activity, TrendingUp, Clock, AlertCircle, CheckCircle2, Zap } from "lucide-react";

// Sample data - replace with actual API data
const sampleData = {
  "simulationId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
  "tests": [
    {
      "loopStartTime": 1762866328915,
      "r1_time": 774,
      "r2_time": 9479,
      "signTimeMs": 647,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 10905
    },
    {
      "loopStartTime": 1762866328920,
      "r1_time": 2260,
      "r2_time": 9242,
      "signTimeMs": 179,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 11683
    },
    {
      "loopStartTime": 1762866328916,
      "r1_time": 799,
      "r2_time": 13596,
      "signTimeMs": 631,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 15028
    },
    {
      "loopStartTime": 1762866328918,
      "r1_time": 1263,
      "r2_time": 13538,
      "signTimeMs": 579,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 15383
    },
    {
      "loopStartTime": 1762866328916,
      "r1_time": 1270,
      "r2_time": 14214,
      "signTimeMs": 581,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 16065
    },
    {
      "loopStartTime": 1762866328921,
      "r1_time": 1760,
      "r2_time": 14447,
      "signTimeMs": 178,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 16385
    },
    {
      "loopStartTime": 1762866328920,
      "r1_time": 1764,
      "r2_time": 15282,
      "signTimeMs": 185,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 17233
    },
    {
      "loopStartTime": 1762866328919,
      "r1_time": 2264,
      "r2_time": 15018,
      "signTimeMs": 186,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 17468
    },
    {
      "loopStartTime": 1762866328918,
      "r1_time": 2766,
      "r2_time": 15086,
      "signTimeMs": 182,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 18036
    },
    {
      "loopStartTime": 1762866328920,
      "r1_time": 3258,
      "r2_time": 15176,
      "signTimeMs": 175,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 18610
    },
    {
      "loopStartTime": 1762866328917,
      "r1_time": 3764,
      "r2_time": 15033,
      "signTimeMs": 178,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 18977
    },
    {
      "loopStartTime": 1762866328901,
      "r1_time": 4282,
      "r2_time": 15175,
      "signTimeMs": 178,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 19636
    },
    {
      "loopStartTime": 1762866328916,
      "r1_time": 4763,
      "r2_time": 15081,
      "signTimeMs": 175,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 20020
    },
    {
      "loopStartTime": 1762866328917,
      "r1_time": 5264,
      "r2_time": 15075,
      "signTimeMs": 180,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 20520
    },
    {
      "loopStartTime": 1762866328920,
      "r1_time": 5756,
      "r2_time": 14976,
      "signTimeMs": 176,
      "statusCode": 200,
      "testId": "f71bfa3d-4580-46aa-9b0c-928531f2cb59",
      "totalTimeMs": 20909
    }
  ]
};

const Index = () => {
  const [testData] = useState(sampleData);

  // Calculate metrics
  const totalRequests = testData.tests.length;
  const successfulRequests = testData.tests.filter(t => t.statusCode === 200).length;
  const successRate = ((successfulRequests / totalRequests) * 100).toFixed(1);
  const avgResponseTime = (testData.tests.reduce((acc, t) => acc + t.totalTimeMs, 0) / totalRequests).toFixed(0);
  const errorRate = (((totalRequests - successfulRequests) / totalRequests) * 100).toFixed(1);

  // Prepare chart data
  const timeSeriesData = testData.tests.map((test, index) => ({
    index: index + 1,
    time: new Date(test.loopStartTime).toLocaleTimeString(),
    totalTime: test.totalTimeMs,
    r1Time: test.r1_time,
    signTime: test.signTimeMs,
    r2Time: test.r2_time,
    statusCode: test.statusCode,
  }));

  const statusDistribution = [
    { name: "Success (200)", value: testData.tests.filter(t => t.statusCode === 200).length, color: "hsl(var(--success))" },
    { name: "Server Error (500)", value: testData.tests.filter(t => t.statusCode === 500).length, color: "hsl(var(--destructive))" },
    { name: "Client Error (4xx)", value: testData.tests.filter(t => t.statusCode >= 400 && t.statusCode < 500 && t.statusCode !== 402).length, color: "hsl(var(--warning))" },
  ].filter(item => item.value > 0);

  const avgBreakdown = [
    { name: "Request 1", time: (testData.tests.reduce((acc, t) => acc + t.r1_time, 0) / totalRequests).toFixed(0) },
    { name: "Signing", time: (testData.tests.reduce((acc, t) => acc + t.signTimeMs, 0) / totalRequests).toFixed(0) },
    { name: "Request 2", time: (testData.tests.reduce((acc, t) => acc + t.r2_time, 0) / totalRequests).toFixed(0) },
  ];

  const performanceDistribution = testData.tests.reduce((acc, test) => {
    const bucket = Math.floor(test.totalTimeMs / 500) * 500;
    const key = `${bucket}-${bucket + 500}ms`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const performanceData = Object.entries(performanceDistribution).map(([range, count]) => ({
    range,
    count,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            x402 Load Tester Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time performance metrics and analytics for test: <span className="font-mono text-primary">{testData.simulationId}</span>
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">Simulated agent requests</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:shadow-lg hover:shadow-success/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{successRate}%</div>
              <p className="text-xs text-muted-foreground">{successfulRequests} successful requests</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">End-to-end latency</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:shadow-lg hover:shadow-destructive/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{errorRate}%</div>
              <p className="text-xs text-muted-foreground">{totalRequests - successfulRequests} failed requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Response Time Over Time
                </CardTitle>
                <CardDescription>Track performance trends across all test iterations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="index" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="totalTime" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#colorTotal)"
                      strokeWidth={2}
                      name="Total Time (ms)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Status Code Distribution</CardTitle>
                  <CardDescription>Request success vs failure breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Response time histogram</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  Average Time Breakdown
                </CardTitle>
                <CardDescription>Where time is spent in the x402 payment flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={avgBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar dataKey="time" fill="hsl(var(--primary))" name="Average Time (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Detailed Time Breakdown</CardTitle>
                <CardDescription>All components of each request</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="index" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="r1Time" stroke="hsl(var(--chart-1))" strokeWidth={2} name="R1 Time" />
                    <Line type="monotone" dataKey="signTime" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Sign Time" />
                    <Line type="monotone" dataKey="r2Time" stroke="hsl(var(--chart-3))" strokeWidth={2} name="R2 Time" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Performance Percentiles</CardTitle>
                <CardDescription>Statistical distribution of response times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const sortedTimes = [...testData.tests].sort((a, b) => a.totalTimeMs - b.totalTimeMs);
                    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)]?.totalTimeMs || 0;
                    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)]?.totalTimeMs || 0;
                    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)]?.totalTimeMs || 0;
                    const min = sortedTimes[0]?.totalTimeMs || 0;
                    const max = sortedTimes[sortedTimes.length - 1]?.totalTimeMs || 0;

                    return (
                      <>
                        <div className="grid gap-4 md:grid-cols-5">
                          <div className="space-y-1 rounded-lg bg-secondary p-4">
                            <p className="text-sm text-muted-foreground">Min</p>
                            <p className="text-2xl font-bold text-success">{min}ms</p>
                          </div>
                          <div className="space-y-1 rounded-lg bg-secondary p-4">
                            <p className="text-sm text-muted-foreground">P50 (Median)</p>
                            <p className="text-2xl font-bold text-foreground">{p50}ms</p>
                          </div>
                          <div className="space-y-1 rounded-lg bg-secondary p-4">
                            <p className="text-sm text-muted-foreground">P95</p>
                            <p className="text-2xl font-bold text-warning">{p95}ms</p>
                          </div>
                          <div className="space-y-1 rounded-lg bg-secondary p-4">
                            <p className="text-sm text-muted-foreground">P99</p>
                            <p className="text-2xl font-bold text-destructive">{p99}ms</p>
                          </div>
                          <div className="space-y-1 rounded-lg bg-secondary p-4">
                            <p className="text-sm text-muted-foreground">Max</p>
                            <p className="text-2xl font-bold text-destructive">{max}ms</p>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))", 
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)"
                              }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Requests" />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Detailed Test Results</CardTitle>
                <CardDescription>Individual request breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr className="text-left">
                        <th className="pb-2 font-medium text-muted-foreground">#</th>
                        <th className="pb-2 font-medium text-muted-foreground">Timestamp</th>
                        <th className="pb-2 font-medium text-muted-foreground">Status</th>
                        <th className="pb-2 font-medium text-muted-foreground">R1 Time</th>
                        <th className="pb-2 font-medium text-muted-foreground">Sign Time</th>
                        <th className="pb-2 font-medium text-muted-foreground">R2 Time</th>
                        <th className="pb-2 font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {testData.tests.map((test, index) => (
                        <tr key={index} className="hover:bg-secondary/50 transition-colors">
                          <td className="py-3 text-muted-foreground">{index + 1}</td>
                          <td className="py-3 font-mono text-xs">{new Date(test.loopStartTime).toLocaleTimeString()}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              test.statusCode === 200 
                                ? "bg-success/10 text-success" 
                                : "bg-destructive/10 text-destructive"
                            }`}>
                              {test.statusCode}
                            </span>
                          </td>
                          <td className="py-3 font-mono">{test.r1_time}ms</td>
                          <td className="py-3 font-mono">{test.signTimeMs}ms</td>
                          <td className="py-3 font-mono">{test.r2_time}ms</td>
                          <td className="py-3 font-mono font-bold text-primary">{test.totalTimeMs}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

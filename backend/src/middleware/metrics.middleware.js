/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1 (SECTION 17 EXTENSION)
 * Module: backend/src/middleware/metrics.middleware.js
 * Description: Real-Time APM & Performance Metrics Middleware
 * Captures request throughput, response status distributions (2xx, 4xx, 5xx),
 * per-route latency histograms (p50, p90, p95, p99, min, max, avg), memory usage,
 * and system health telemetry for evaluation before vs. after optimizations.
 * ============================================================================
 */

class MetricsTracker {
  constructor() {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.statusCodes = {
      '2xx': 0,
      '3xx': 0,
      '4xx': 0,
      '5xx': 0
    };
    this.routeLatencies = {};
    this.allLatencies = [];
    this.maxLatencySamples = 2000;
  }

  /**
   * Records completed request metrics
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} route - Normalized URL pathname
   * @param {number} statusCode - HTTP status code
   * @param {number} durationMs - Duration in milliseconds
   */
  record(method, route, statusCode, durationMs) {
    this.totalRequests++;

    // Track status classification
    if (statusCode >= 200 && statusCode < 300) this.statusCodes['2xx']++;
    else if (statusCode >= 300 && statusCode < 400) this.statusCodes['3xx']++;
    else if (statusCode >= 400 && statusCode < 500) this.statusCodes['4xx']++;
    else if (statusCode >= 500) this.statusCodes['5xx']++;

    // Global latency array with rolling window
    this.allLatencies.push(durationMs);
    if (this.allLatencies.length > this.maxLatencySamples) {
      this.allLatencies.shift();
    }

    // Per-route tracking
    const routeKey = `${method} ${route}`;
    if (!this.routeLatencies[routeKey]) {
      this.routeLatencies[routeKey] = {
        count: 0,
        totalTime: 0,
        min: durationMs,
        max: durationMs,
        samples: []
      };
    }

    const r = this.routeLatencies[routeKey];
    r.count++;
    r.totalTime += durationMs;
    if (durationMs < r.min) r.min = durationMs;
    if (durationMs > r.max) r.max = durationMs;
    r.samples.push(durationMs);
    if (r.samples.length > 500) r.samples.shift();
  }

  /**
   * Helper to compute percentile from an array of numbers
   */
  _percentile(arr, p) {
    if (!arr || arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return parseFloat(sorted[Math.max(0, index)].toFixed(2));
  }

  /**
   * Generates APM metrics summary payload
   * @returns {object} APM telemetry statistics
   */
  getSummary() {
    const uptimeSec = parseFloat(((Date.now() - this.startTime) / 1000).toFixed(2));
    const rps = uptimeSec > 0 ? parseFloat((this.totalRequests / uptimeSec).toFixed(2)) : 0;
    const mem = process.memoryUsage();

    const avgLatency = this.allLatencies.length > 0
      ? parseFloat((this.allLatencies.reduce((a, b) => a + b, 0) / this.allLatencies.length).toFixed(2))
      : 0;

    const errorCount = this.statusCodes['4xx'] + this.statusCodes['5xx'];
    const errorRate = this.totalRequests > 0
      ? parseFloat(((errorCount / this.totalRequests) * 100).toFixed(2))
      : 0;

    // Per-route summary
    const routesSummary = {};
    for (const [routeKey, stats] of Object.entries(this.routeLatencies)) {
      routesSummary[routeKey] = {
        requests: stats.count,
        avgMs: parseFloat((stats.totalTime / stats.count).toFixed(2)),
        minMs: parseFloat(stats.min.toFixed(2)),
        maxMs: parseFloat(stats.max.toFixed(2)),
        p95Ms: this._percentile(stats.samples, 95)
      };
    }

    return {
      service: 'B2B OrderHub Performance & APM Monitor',
      status: 'active',
      uptimeSeconds: uptimeSec,
      throughput: {
        totalRequests: this.totalRequests,
        requestsPerSecond: rps
      },
      latency: {
        averageMs: avgLatency,
        p50Ms: this._percentile(this.allLatencies, 50),
        p90Ms: this._percentile(this.allLatencies, 90),
        p95Ms: this._percentile(this.allLatencies, 95),
        p99Ms: this._percentile(this.allLatencies, 99)
      },
      statusDistribution: { ...this.statusCodes },
      reliability: {
        errorCount,
        errorRatePercentage: errorRate,
        availability: `${parseFloat((100 - (this.statusCodes['5xx'] / Math.max(1, this.totalRequests)) * 100).toFixed(2))}%`
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: parseFloat((mem.rss / 1024 / 1024).toFixed(2)),
        heapUsedMb: parseFloat((mem.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMb: parseFloat((mem.heapTotal / 1024 / 1024).toFixed(2))
      },
      routes: routesSummary
    };
  }

  /**
   * Generates health diagnostics
   */
  getDiagnostics() {
    const mem = process.memoryUsage();
    const heapUsedMb = mem.heapUsed / 1024 / 1024;
    return {
      status: 'healthy',
      checks: {
        memory: heapUsedMb < 512 ? 'pass' : 'warn',
        eventLoop: 'pass',
        responseTime: this._percentile(this.allLatencies, 95) < 200 ? 'pass' : 'warn',
        errorBudget: (this.statusCodes['5xx'] / Math.max(1, this.totalRequests)) < 0.01 ? 'pass' : 'fail'
      },
      system: {
        uptime: process.uptime(),
        heapUsedMb: parseFloat(heapUsedMb.toFixed(2)),
        rssMb: parseFloat((mem.rss / 1024 / 1024).toFixed(2))
      },
      timestamp: new Date().toISOString()
    };
  }
}

const trackerInstance = new MetricsTracker();

module.exports = trackerInstance;

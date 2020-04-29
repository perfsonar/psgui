const TestDefaultValues = {
  tests: [
    'throughput',
    'latency',
    'rtt',
    'trace'
  ],
  defaultparams: {
    general: {
      default_test: 'trace',
    },
    latency: {
      packet_count: 100,
      packet_count_min: 10,
      packet_count_max: 1000000,
      packet_interval: 0.1,
      packet_interval_min: 0.000001,
      packet_interval_max: 1,
      packet_timeout: 2,
      packet_timeout_min: 1,
      packet_timeout_max: 10,
      packet_padding: 20,
      packet_padding_min: 14,
      packet_padding_max: 20000,
    },
    rtt: {
      packets_per_test: 5,
      packets_per_test_min: 1,
      packets_per_test_max: 100,
      time_between_packets: 1,
      time_between_packets_min: 1,
      time_between_packets_max: 100,
      packet_size: 1000,
      packet_size_min: 1,
      packet_size_max: 20000,
    },
    throughput: {
      protocol: 'TCP',
      test_duration: 10,
      test_duration_min: 1,
      test_duration_max: 1000,
      test_duration_units: 'S',
      tool: 'iperf3,iperf',
      autotuning: false,
      parallelstreams: 1,
      parallelstreams_min: 1,
      parallelstreams_max: 64,
      omitinterval: 0,
      omitinterval_min: 0,
      omitinterval_max: 100,
      zerocopy: false,
      tos_bits: 0,
      tos_bits_min: 0,
      tos_bits_max: 511,
      window_size: '',
      window_size_min: '0',
      window_size_max: '1GB',
    },
    trace: {
      tool: 'traceroute,tracepath',
      packet_size: 1000,
      packet_size_min: 1,
      packet_size_max: 20000,
      first_ttl: 1,
      max_ttl: 30,
      max_ttl_min: 1,
      max_ttl_max: 100,
    }
  }
}

export default TestDefaultValues;
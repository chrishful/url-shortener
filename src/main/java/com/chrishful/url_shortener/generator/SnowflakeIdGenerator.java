package com.chrishful.url_shortener.generator;

import org.springframework.stereotype.Component;

@Component
public class SnowflakeIdGenerator {

    private long lastTimestamp = -1L;
    private long sequence = 0L;

    private static final long MACHINE_ID_BITS = 10L;
    private static final long SEQUENCE_BITS = 12L;
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS); // 4095
    private static final long TIMESTAMP_SHIFT = MACHINE_ID_BITS + SEQUENCE_BITS;
    private static final long MACHINE_ID_SHIFT = SEQUENCE_BITS;
    private static final long EPOCH = 1700000000000L; // custom epoch

    public SnowflakeIdGenerator() {
    }

    public synchronized long nextId() {
        long timestamp = System.currentTimeMillis();

        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) {
                while (timestamp <= lastTimestamp) {
                    timestamp = System.currentTimeMillis();
                }
            }
        } else {
            sequence = 0L;
        }

        lastTimestamp = timestamp;

        long machineId = 1L;
        return ((timestamp - EPOCH) << TIMESTAMP_SHIFT)
                | (machineId << MACHINE_ID_SHIFT)
                | sequence;
    }
}
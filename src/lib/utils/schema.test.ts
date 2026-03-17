/**
 * Unit tests for schema utility builders, verifying stable JSON-LD output for SEO metadata features.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { personSchema, webApiSchema, getFullSchemaGraph } from '@/lib/utils/schema';

// Group schema assertions by builder to catch regressions in structured data contracts.
describe('schema utilities', () => {
  // Group related test behavior in this suite.
  describe('personSchema', () => {
    // Define a focused test case for one behavior.
    it('should return valid person schema object', () => {
      const schema = personSchema();

      // Assert the expected outcome for this scenario.
      expect(schema).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema['@type']).toBe('Person');
      // Assert the expected outcome for this scenario.
      expect(schema.name).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema.url).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema.image).toBeDefined();
    });

    // Define a focused test case for one behavior.
    it('should have correct @id format', () => {
      const schema = personSchema();

      // Assert the expected outcome for this scenario.
      expect(schema['@id']).toContain('#person');
    });

    // Define a focused test case for one behavior.
    it('should include knowsAbout array', () => {
      const schema = personSchema() as { knowsAbout: unknown[] };

      // Assert the expected outcome for this scenario.
      expect(schema.knowsAbout).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(Array.isArray(schema.knowsAbout)).toBe(true);
      // Assert the expected outcome for this scenario.
      expect((schema.knowsAbout as string[]).length).toBeGreaterThan(0);
    });
  });

  // Group related test behavior in this suite.
  describe('webApiSchema', () => {
    // Define a focused test case for one behavior.
    it('should return valid WebAPI schema object', () => {
      const schema = webApiSchema();

      // Assert the expected outcome for this scenario.
      expect(schema).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema['@type']).toBe('WebAPI');
      // Assert the expected outcome for this scenario.
      expect(schema.name).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema.description).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema.url).toBeDefined();
    });

    // Define a focused test case for one behavior.
    it('should have correct @id format', () => {
      const schema = webApiSchema();

      // Assert the expected outcome for this scenario.
      expect(schema['@id']).toContain('#webapi');
    });

    // Define a focused test case for one behavior.
    it('should have provider with person reference', () => {
      const schema = webApiSchema();

      // Assert the expected outcome for this scenario.
      expect(schema.provider).toBeDefined();
      // Assert the expected outcome for this scenario.
      expect(schema.provider['@id']).toContain('#person');
    });
  });

  // Group related test behavior in this suite.
  describe('getFullSchemaGraph', () => {
    // Define a focused test case for one behavior.
    it('should return array with person and webapi schemas', () => {
      const graph = getFullSchemaGraph();

      // Assert the expected outcome for this scenario.
      expect(Array.isArray(graph)).toBe(true);
      // Assert the expected outcome for this scenario.
      expect(graph.length).toBe(2);
      // Assert the expected outcome for this scenario.
      expect(graph[0]['@type']).toBe('Person');
      // Assert the expected outcome for this scenario.
      expect(graph[1]['@type']).toBe('WebAPI');
    });
  });
});

/**
 * Response Handler Service
 * Handles validation, safety checks, and formatting of LLM responses
 */

export interface SafetyCheckResult {
  isSafe: boolean;
  warnings: string[];
  confidence: number;
}

export interface ResponseValidationResult {
  isValid: boolean;
  content: string;
  warnings: string[];
  requiresFallback: boolean;
}

/**
 * Check for hallucination indicators in response
 */
const hallucIndicators = [
  'i think',
  'probably',
  'might be',
  'could be',
  'i suppose',
  'perhaps',
  'seems like',
  'appears to',
  'likely to',
  'in my opinion',
  'i believe',
];

/**
 * Safety check for model output
 */
export const performSafetyCheck = (response: string): SafetyCheckResult => {
  const warnings: string[] = [];
  let hallucScore = 0;

  const lowerResponse = response.toLowerCase();

  // Check for hallucination indicators
  for (const indicator of hallucIndicators) {
    if (lowerResponse.includes(indicator)) {
      hallucScore += 1;
      warnings.push(`Detected potential speculation: "${indicator}"`);
    }
  }

  // Check for excessive confidence without grounding
  if (
    (lowerResponse.match(/definitely|certainly|absolutely/g) || []).length > 3
  ) {
    warnings.push('High confidence claims detected without clear grounding');
  }

  // Check for unknown/unsupported claims
  if (
    lowerResponse.includes('i do not have') ||
    lowerResponse.includes('not mentioned') ||
    lowerResponse.includes('not specified')
  ) {
    hallucScore = 0; // Reset score for honest uncertainty
  }

  const confidence = Math.max(0, 1 - hallucScore / 5);

  return {
    isSafe: confidence > 0.6,
    warnings,
    confidence,
  };
};

/**
 * Validate response structure and content
 */
export const validateResponse = (
  response: string
): ResponseValidationResult => {
  const warnings: string[] = [];
  let isValid = true;
  let requiresFallback = false;

  // Check for empty response
  if (!response || response.trim().length === 0) {
    return {
      isValid: false,
      content: response,
      warnings: ['Empty response from model'],
      requiresFallback: true,
    };
  }

  // Check for error indicators
  if (
    response.toLowerCase().includes('error') &&
    response.toLowerCase().includes('unable to')
  ) {
    warnings.push('Response indicates processing error');
    requiresFallback = true;
  }

  // Check for insufficient information
  if (response.toLowerCase().includes('i do not have enough information')) {
    warnings.push('Model reported insufficient context');
    requiresFallback = true;
  }

  // Perform safety check
  const safetyResult = performSafetyCheck(response);
  if (!safetyResult.isSafe) {
    warnings.push(
      ...safetyResult.warnings
    );
    isValid = false;
    requiresFallback = true;
  }

  return {
    isValid: isValid && safetyResult.confidence > 0.6,
    content: response,
    warnings,
    requiresFallback,
  };
};

/**
 * Format response for user consumption
 */
export const formatResponse = (
  content: string,
  includeMetadata: boolean = false
): any => {
  const baseResponse = {
    message: content.trim(),
    timestamp: new Date().toISOString(),
  };

  if (includeMetadata) {
    const validation = validateResponse(content);
    return {
      ...baseResponse,
      metadata: {
        isValid: validation.isValid,
        warnings: validation.warnings,
        requiresFallback: validation.requiresFallback,
      },
    };
  }

  return baseResponse;
};

/**
 * Sanitize response to remove unwanted patterns
 */
export const sanitizeResponse = (response: string): string => {
  let sanitized = response;

  // Remove mentions of being an AI
  sanitized = sanitized.replace(
    /i'm an ai|i am an artificial|i am an ai/gi,
    ''
  );

  // Remove mentions of dataset
  sanitized = sanitized.replace(/i was provided|you gave me|the dataset/gi, '');

  // Remove self-referential comments
  sanitized = sanitized.replace(/as an assistant|as a model/gi, '');

  // Clean up extra whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
};

/**
 * Extract structured data from response (e.g., comparison tables)
 */
export const extractStructuredData = (response: string): {
  hasTable: boolean;
  hasComparison: boolean;
  sections: string[];
} => {
  return {
    hasTable: /\|.*\|/g.test(response),
    hasComparison: /better|worse|pros|cons|advantage|disadvantage/gi.test(
      response
    ),
    sections: response.split('\n\n'),
  };
};

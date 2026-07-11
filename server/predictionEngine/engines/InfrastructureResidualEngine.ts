import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

/**
 * Infrastructure Residual Engine (IRE)
 * 
 * Purpose: Evaluates the long-term residual value created by investment waves and booms.
 * 
 * Unlike price prediction engines, IRE answers the question:
 * "If this boom ends tomorrow, what lasting value will remain?"
 * 
 * IRE estimates the Residual Infrastructure Score (0-100) based on 8 evaluation dimensions:
 * 1. Physical Infrastructure
 * 2. Human Capital
 * 3. Knowledge Assets
 * 4. Digital Infrastructure
 * 5. Standards & Protocols
 * 6. Supply Chain Capability
 * 7. Institutional Impact
 * 8. Cultural Adoption
 * 
 * Examples of historical residual scores:
 * - Tulip Mania: 5 (almost nothing remained)
 * - Railway Mania: 95 (left transportation infrastructure)
 * - Dot-com Bubble: 92 (left the Internet)
 * - AI Boom: (current estimate generated from evidence)
 */
export class InfrastructureResidualEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeResidualValue(features);
    const residualScore = this.calculateResidualScore(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `ire-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction: `Residual Infrastructure Score: ${residualScore}`,
      confidence,
      reason,
      recipeUsed: "infrastructure-residual",
      timestamp: Date.now(),
      metadata: {
        recipeId: "infrastructure-residual",
        recipeName: "Infrastructure Residual Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.totalEvidence,
        predictionVersion: "1.0",
        residualScore,
        dimensions: {
          physicalInfrastructure: analysis.physicalInfrastructure,
          humanCapital: analysis.humanCapital,
          knowledgeAssets: analysis.knowledgeAssets,
          digitalInfrastructure: analysis.digitalInfrastructure,
          standards: analysis.standards,
          supplyChain: analysis.supplyChain,
          institutionalImpact: analysis.institutionalImpact,
          culturalAdoption: analysis.culturalAdoption,
        },
      } as any,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Infrastructure Residual: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);

    return {
      query: lowerQuery,
      words,
      wordCount: words.length,
      length: query.length,
      
      // Physical Infrastructure indicators
      hasPhysicalInfraKeywords: /infrastructure|facility|facilities|plant|plants|factory|factories|data center|data centers|power|grid|network|rail|railway|transportation|building|buildings|asset|assets/.test(lowerQuery),
      hasDataCenterKeywords: /data center|data centers|server|servers|cloud|computing|infrastructure/.test(lowerQuery),
      hasNetworkKeywords: /fiber|network|broadband|5g|6g|connectivity|telecom|communication/.test(lowerQuery),
      hasTransportKeywords: /rail|railway|road|highway|airport|shipping|logistics|transportation/.test(lowerQuery),
      
      // Human Capital indicators
      hasHumanCapitalKeywords: /engineer|scientist|researcher|worker|workforce|talent|skill|training|education|expertise|professional|specialist/.test(lowerQuery),
      hasEngineerKeywords: /engineer|engineering|technical|developer|programmer|architect/.test(lowerQuery),
      hasResearchKeywords: /research|researcher|scientist|discovery|innovation|patent|academic/.test(lowerQuery),
      
      // Knowledge Assets indicators
      hasKnowledgeKeywords: /knowledge|research|documentation|paper|open source|software|code|algorithm|method|process|best practice|standard/.test(lowerQuery),
      hasOpenSourceKeywords: /open source|github|repository|library|framework|toolkit/.test(lowerQuery),
      hasResearchPublicationKeywords: /paper|publication|journal|conference|research|study|analysis/.test(lowerQuery),
      
      // Digital Infrastructure indicators
      hasDigitalInfraKeywords: /platform|api|cloud|software|ecosystem|application|service|saas|paas|iaas/.test(lowerQuery),
      hasCloudKeywords: /cloud|aws|azure|gcp|google cloud|microsoft|amazon/.test(lowerQuery),
      hasAPIKeywords: /api|interface|integration|service|ecosystem/.test(lowerQuery),
      
      // Standards indicators
      hasStandardsKeywords: /standard|protocol|format|specification|iso|ieee|w3c|html|http|tcp|ip|json|xml/.test(lowerQuery),
      hasTechnicalStandardsKeywords: /protocol|standard|specification|format|convention/.test(lowerQuery),
      
      // Supply Chain indicators
      hasSupplyChainKeywords: /manufacturing|production|supply|chain|semiconductor|gpu|chip|battery|component|supplier|factory/.test(lowerQuery),
      hasManufacturingKeywords: /manufacturing|production|factory|fabrication|semiconductor|chip|processor/.test(lowerQuery),
      hasComponentKeywords: /component|part|material|supply|supplier|vendor/.test(lowerQuery),
      
      // Institutional Impact indicators
      hasInstitutionalKeywords: /regulation|government|policy|university|education|institution|investment|funding|law|legislation/.test(lowerQuery),
      hasGovernmentKeywords: /government|policy|regulation|law|legislation|federal|state|national/.test(lowerQuery),
      hasEducationKeywords: /university|education|school|college|academic|training|course/.test(lowerQuery),
      
      // Cultural Adoption indicators
      hasCulturalKeywords: /adoption|behavior|usage|user|consumer|society|culture|habit|lifestyle|daily|everyday|widespread|ubiquitous/.test(lowerQuery),
      hasAdoptionKeywords: /adoption|adoption rate|user|consumer|market penetration|widespread/.test(lowerQuery),
      hasBehaviorChangeKeywords: /behavior|habit|lifestyle|daily|everyday|routine|normal|common/.test(lowerQuery),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeResidualValue(features: Record<string, any>): {
    physicalInfrastructure: number;
    humanCapital: number;
    knowledgeAssets: number;
    digitalInfrastructure: number;
    standards: number;
    supplyChain: number;
    institutionalImpact: number;
    culturalAdoption: number;
    totalEvidence: number;
  } {
    let totalEvidence = 0;

    // Physical Infrastructure (0-100)
    let physicalInfrastructure = 20;
    if (features.hasPhysicalInfraKeywords) {
      physicalInfrastructure = 50;
      totalEvidence += 1;
    }
    if (features.hasDataCenterKeywords || features.hasNetworkKeywords) {
      physicalInfrastructure = Math.min(100, physicalInfrastructure + 25);
      totalEvidence += 1;
    }
    if (features.hasTransportKeywords) {
      physicalInfrastructure = Math.min(100, physicalInfrastructure + 20);
      totalEvidence += 1;
    }

    // Human Capital (0-100)
    let humanCapital = 20;
    if (features.hasHumanCapitalKeywords) {
      humanCapital = 50;
      totalEvidence += 1;
    }
    if (features.hasEngineerKeywords) {
      humanCapital = Math.min(100, humanCapital + 25);
      totalEvidence += 1;
    }
    if (features.hasResearchKeywords) {
      humanCapital = Math.min(100, humanCapital + 20);
      totalEvidence += 1;
    }

    // Knowledge Assets (0-100)
    let knowledgeAssets = 20;
    if (features.hasKnowledgeKeywords) {
      knowledgeAssets = 50;
      totalEvidence += 1;
    }
    if (features.hasOpenSourceKeywords) {
      knowledgeAssets = Math.min(100, knowledgeAssets + 25);
      totalEvidence += 1;
    }
    if (features.hasResearchPublicationKeywords) {
      knowledgeAssets = Math.min(100, knowledgeAssets + 20);
      totalEvidence += 1;
    }

    // Digital Infrastructure (0-100)
    let digitalInfrastructure = 20;
    if (features.hasDigitalInfraKeywords) {
      digitalInfrastructure = 50;
      totalEvidence += 1;
    }
    if (features.hasCloudKeywords) {
      digitalInfrastructure = Math.min(100, digitalInfrastructure + 25);
      totalEvidence += 1;
    }
    if (features.hasAPIKeywords) {
      digitalInfrastructure = Math.min(100, digitalInfrastructure + 20);
      totalEvidence += 1;
    }

    // Standards & Protocols (0-100)
    let standards = 20;
    if (features.hasStandardsKeywords) {
      standards = 60;
      totalEvidence += 1;
    }
    if (features.hasTechnicalStandardsKeywords) {
      standards = Math.min(100, standards + 20);
      totalEvidence += 1;
    }

    // Supply Chain Capability (0-100)
    let supplyChain = 20;
    if (features.hasSupplyChainKeywords) {
      supplyChain = 50;
      totalEvidence += 1;
    }
    if (features.hasManufacturingKeywords) {
      supplyChain = Math.min(100, supplyChain + 25);
      totalEvidence += 1;
    }
    if (features.hasComponentKeywords) {
      supplyChain = Math.min(100, supplyChain + 20);
      totalEvidence += 1;
    }

    // Institutional Impact (0-100)
    let institutionalImpact = 20;
    if (features.hasInstitutionalKeywords) {
      institutionalImpact = 50;
      totalEvidence += 1;
    }
    if (features.hasGovernmentKeywords) {
      institutionalImpact = Math.min(100, institutionalImpact + 25);
      totalEvidence += 1;
    }
    if (features.hasEducationKeywords) {
      institutionalImpact = Math.min(100, institutionalImpact + 20);
      totalEvidence += 1;
    }

    // Cultural Adoption (0-100)
    let culturalAdoption = 20;
    if (features.hasCulturalKeywords) {
      culturalAdoption = 50;
      totalEvidence += 1;
    }
    if (features.hasAdoptionKeywords) {
      culturalAdoption = Math.min(100, culturalAdoption + 25);
      totalEvidence += 1;
    }
    if (features.hasBehaviorChangeKeywords) {
      culturalAdoption = Math.min(100, culturalAdoption + 20);
      totalEvidence += 1;
    }

    return {
      physicalInfrastructure,
      humanCapital,
      knowledgeAssets,
      digitalInfrastructure,
      standards,
      supplyChain,
      institutionalImpact,
      culturalAdoption,
      totalEvidence: Math.max(1, totalEvidence),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private calculateResidualScore(analysis: {
    physicalInfrastructure: number;
    humanCapital: number;
    knowledgeAssets: number;
    digitalInfrastructure: number;
    standards: number;
    supplyChain: number;
    institutionalImpact: number;
    culturalAdoption: number;
    totalEvidence: number;
  }): number {
    // Calculate weighted average of all dimensions
    const totalScore =
      analysis.physicalInfrastructure * 0.15 +
      analysis.humanCapital * 0.15 +
      analysis.knowledgeAssets * 0.15 +
      analysis.digitalInfrastructure * 0.15 +
      analysis.standards * 0.1 +
      analysis.supplyChain * 0.1 +
      analysis.institutionalImpact * 0.1 +
      analysis.culturalAdoption * 0.15;

    return Math.round(totalScore);
  }

  private calculateConfidence(analysis: {
    totalEvidence: number;
  }): number {
    // Confidence increases with evidence count
    // Base confidence: 0.4 (40%)
    // Additional confidence per evidence: 0.06 (6%)
    // Maximum confidence: 0.95 (95%)
    const baseConfidence = 0.4;
    const additionalConfidence = Math.min(0.55, analysis.totalEvidence * 0.06);
    return Math.min(0.95, baseConfidence + additionalConfidence);
  }

  private generateReason(analysis: {
    physicalInfrastructure: number;
    humanCapital: number;
    knowledgeAssets: number;
    digitalInfrastructure: number;
    standards: number;
    supplyChain: number;
    institutionalImpact: number;
    culturalAdoption: number;
  }): string {
    const dimensions = [
      { name: "Physical Infrastructure", score: analysis.physicalInfrastructure },
      { name: "Human Capital", score: analysis.humanCapital },
      { name: "Knowledge Assets", score: analysis.knowledgeAssets },
      { name: "Digital Infrastructure", score: analysis.digitalInfrastructure },
      { name: "Standards & Protocols", score: analysis.standards },
      { name: "Supply Chain", score: analysis.supplyChain },
      { name: "Institutional Impact", score: analysis.institutionalImpact },
      { name: "Cultural Adoption", score: analysis.culturalAdoption },
    ];

    // Sort by score to identify strongest dimensions
    const sorted = [...dimensions].sort((a, b) => b.score - a.score);
    const topDimensions = sorted.slice(0, 3);
    const topNames = topDimensions.map((d) => d.name).join(", ");

    return `Infrastructure Residual Engine analysis shows strongest residual value potential in: ${topNames}. This suggests the boom may leave lasting infrastructure, human capital, or institutional changes that persist beyond the initial investment cycle.`;
  }
}

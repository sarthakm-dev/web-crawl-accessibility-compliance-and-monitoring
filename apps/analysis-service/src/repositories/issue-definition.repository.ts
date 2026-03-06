import { IssueDefinition } from '@packages/shared-models/issue-definition.model';

export const IssueDefinitionRepository = {
  async findOrCreateByRule(violation: any, transaction: any) {
    return IssueDefinition.findOrCreate({
      where: { rule_code: violation.id },
      defaults: {
        name: violation.help,
        description: violation.description,
        severity: violation.impact || 'minor',
        wcag_reference: violation.tags?.join(','),
      },
      transaction,
    });
  },
};

import { Request, Response } from 'express';
import {
  exportReportSchema,
  issuesBreakdownSchema,
  issuesTableSchema,
  siteSummarySchema,
  topPagesSchema,
} from '@packages/shared-validation/report.schema';

import { ReportsService } from '../services/reports.service';
import { handleError } from '@packages/shared-utils/error-handler';
import { AuthRequest } from '@packages/shared-types/auth.types';

export const ReportsController = {
  async siteSummary(req: Request, res: Response) {
    try {
      // add zod validation
      const parsed = siteSummarySchema.parse(req.query);
      // add site summary service
      const data = await ReportsService.getSiteSummary(
        parsed.siteId,
        parsed.crawlJobId,
        parsed.startDate,
        parsed.endDate
      );

      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async issuesBreakdown(req: Request, res: Response) {
    try {
      // add zod validation
      const parsed = issuesBreakdownSchema.parse(req.query);
      // add service for site severity breakdown report
      const data = await ReportsService.getSeverityBreakdown(
        parsed.siteId,
        parsed.crawlJobId,
        parsed.startDate,
        parsed.endDate
      );

      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async topPages(req: Request, res: Response) {
    try {
      // add zod validation for query
      const parsed = topPagesSchema.parse(req.query);
      // add service to get top pages
      const pages = await ReportsService.getTopPages(
        parsed.siteId,
        parsed.crawlJobId,
        parsed.startDate,
        parsed.endDate
      );

      res.status(200).json(pages);
    } catch (error) {
      handleError(res, error);
    }
  },

  async issuesTable(req: Request, res: Response) {
    try {
      // add zod validation
      const parsed = issuesTableSchema.parse(req.query);
      // add service to get issues
      const data = await ReportsService.getIssues(
        parsed.siteId,
        parsed.severity,
        parsed.limit,
        parsed.page,
        parsed.crawlJobId,
        parsed.startDate,
        parsed.endDate
      );

      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async exportReport(req: AuthRequest, res: Response) {
    try {
      // add zod validation for req body
      const parsed = exportReportSchema.parse(req.body);

      const userId = req.userId;
      // handle unauthorized user
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // generate report for reportId
      const reportId = await ReportsService.generateReport({
        siteId: parsed.siteId,
        crawlJobId: parsed.crawlJobId,
        reportType: parsed.reportType,
        filters: parsed.filters,
        userId,
      });

      res.status(202).json({
        message:
          'Your report is being generated. You will receive an email when it is ready.',
        reportId,
      });
    } catch (error) {
      handleError(res, error);
    }
  },
};

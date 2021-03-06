import { Request, Response } from 'express';

import { ErrorResponse } from '@utils/types';
import { AuthorsService } from '@modules/authors';
import { ReportsResponse, reportsToReportResponse } from '@dtos/index';

import { Reports } from '../entities/reports';
import { ReportsService } from '../services/reports.service';

export class ReportsController {
    reportService: ReportsService;

    authorService: AuthorsService;

    constructor() {
      this.reportService = ReportsService.getInstance();
      this.authorService = AuthorsService.getInstance();
    }

    getReport = (
      req: Request,
      res: Response<{ data: ReportsResponse } | { code: string, message: string}>,
    ) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          code: 'c-001-g-001',
          message: 'id is not specified.',
        });
      }

      const response = this.reportService.getReport(id);

      if (!response) {
        return res.status(404).json({
          code: 'c-001-g-002',
          message: 'Report not found.',
        });
      }

      const data: ReportsResponse = reportsToReportResponse(
        response,
        this.authorService.getAuthor(response.authorId),
      );

      return res.status(200).json({
        data,
      });
    }

    getReports = (
      req: Request,
      res: Response<{ data: ReportsResponse[] }>,
    ) => {
      const response = this.reportService.getReports();

      const authors = this.authorService.getAuthorByIds(response.map((report) => report.authorId));

      const data: ReportsResponse[] = response.map(
        (report) => reportsToReportResponse(report, authors.find(
          (author) => report.authorId === author.id,
        )),
      );

      return res.status(200).json({
        data,
      });
    }

    createReport = (
      req: Request,
      res: Response<{ data: ReportsResponse } | { code: string, message: string}>,
    ) => {
      const {
        data,
        title,
        authorId,
      } = req.body;

      const report: Partial<Reports> = {
        title,
        data,
        authorId,
      };

      const author = this.authorService.getAuthor(report.authorId);

      if (!author) {
        return res.status(404).json({
          code: 'c-001-c-001',
          message: 'Author not found.',
        });
      }

      const response: any = this.reportService.createReport(report);

      if (response.errorCode) {
        const errorResponse = response as ErrorResponse;

        return res.status(errorResponse.status).json({
          code: errorResponse.errorCode,
          message: errorResponse.message,
        });
      }

      const reportsResponse: ReportsResponse = reportsToReportResponse(response, author);

      return res.status(201).json({
        data: reportsResponse,
      });
    }

    updateReport = (
      req: Request,
      res: Response<{ data: ReportsResponse } | { code: string, message: string}>,
    ) => {
      const { id } = req.params;
      const {
        data,
        title,
        authorId,
      } = req.body;

      const report: Partial<Reports> = {
        title,
        data,
        authorId,
      };

      if (report.authorId) {
        const author = this.authorService.getAuthor(report.authorId);

        if (!author) {
          return res.status(404).json({
            code: 'c-001-u-001',
            message: 'Author not found.',
          });
        }
      }

      const response: any = this.reportService.updateReport(id, report);

      if (response?.errorCode) {
        const errorResponse = response as ErrorResponse;

        return res.status(errorResponse.status).json({
          code: errorResponse.errorCode,
          message: errorResponse.message,
        });
      }

      return res.status(200).json({
        message: 'Report updated successfully.',
        data: response,
      });
    }

    deleteReport = (
      req: Request,
      res: Response<{ code?: string, message: string}>,
    ) => {
      const { id } = req.params;

      const response: any = this.reportService.deleteReport(id);

      if (response.errorCode) {
        const errorResponse = response as ErrorResponse;

        return res.status(errorResponse.status).json({
          code: errorResponse.errorCode,
          message: errorResponse.message,
        });
      }

      return res.status(204).json({
        message: 'Report deleted successfully.',
      });
    }
}

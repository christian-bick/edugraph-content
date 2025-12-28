# Imagine Content

## Introduction

Imagine Content is a powerful tool for generating printable, educational worksheets for children. This project provides a flexible and extensible framework for creating a wide variety of math-related exercises, from basic counting to more complex arithmetic problems.

The worksheets are defined programmatically and rendered into HTML to simplify stlying and debugging. During generation these HTML previews are converted into PDFs for easy printing and distribution.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

Install the dependencies with the packing manager of your choice:

```bash
npm install
```

## Usage

This project uses `vite` for development and `vite-node` to run generation scripts.

### Development Server

To start the development server and view the worksheets in your browser, run:

```bash
npm run dev
```

This will start a local server, and you can navigate to the different worksheet URLs to see them rendered live.

### Generating PDFs

To generate PDF versions of the worksheets, use the `generate` script:

```bash
npm run generate
```

This will create the PDF files in the `dist` directory. To run without creating files, use:
```bash
npm run generate:dry
```

### Running Tests

To run the test suite, use the `test` script:

```bash
npm run test
```

## Module Structure

The project is organized into the following main directories:

*   `src/lib`: Contains core logic and helper functions, such as the `PermutationBuilder` and labeling utilities.
*   `src/partials`: Reusable HTML partials, like headers and footers, used across different worksheet pages.
*   `src/scripts`: Houses the main scripts for generating PDFs (`generate-pdf.ts`) and other automation tasks.
*   `src/worksheets`: This is the core directory where each type of worksheet is defined. Each subdirectory here represents a single worksheet type and contains its generator, HTML template, and styles.

### Worksheet Modules

Each worksheet module within `src/worksheets` follows this general structure:

*   `generator.ts`: This file exports functions to generate all permutations of a worksheet, create a unique name for each permutation, and generate descriptive labels (metadata).
*   `worksheet.html`: The HTML template for the worksheet. It contains the basic layout and placeholders for the generated content.
*   `worksheet.scss`: The SASS file containing the styles specific to that worksheet.
*   `worksheet.ts`: This is the TypeScript entry point for the worksheet page. It often contains the logic to generate the problems and render them into the HTML template.

## Metadata and Labeling

Each worksheet generator (`generator.ts`) is responsible for producing not just the content of the worksheet, but also a set of descriptive metadata. This is handled by the `generateLabels` function within each generator.

These labels are imported from the `edugraph-ts` library and provide a standardized way to describe the educational competences addressed for each worksheet using the [EduGraph ontology](https://github.com/christian-bick/edugraph-ontology).

This metadata can be used for:

*   model training and fine-tuning for classification models
*   generating embeddings (e.g. with the EduGraph embedding model)
*   using it as metadata in search databases like ElasticSearch

## Contributing

Contributions are particularly welcome and least complicate in the form of new worksheet modules. Please feel free to submit a new module via pull request!

By contributing this way, you not only add to a growing database of worksheets available to everyone forever, but also add to a repository of labeled training data to train open source AI education models.

For all other forms of contributions, it is **highly recommended to open a Github issue** in advance.

## License

This project is licensed under the Apache 2.0 License. See the LICENSE file for details.

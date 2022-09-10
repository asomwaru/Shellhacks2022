resource "google_storage_bucket" "ocr_file_processing" {
  name          = "ocr-file-processing"
  location      = "US"
  force_destroy = false

  # uniform_bucket_level_access = true
  cors {
    origin          = ["*"] # TODO: Change origin when frontend is deployed
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

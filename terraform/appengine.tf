resource "google_app_engine_application" "frontend" {
  project     = google_project.project.project_id
  location_id = "us-east1"
}

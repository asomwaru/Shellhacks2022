provider "google" {
  project = var.project_name
  region  = var.region
  zone    = var.zone
  # credentials = file("${path.module}/account.json")
}

resource "google_project" "project" {
  name       = "Shell Hacks"
  project_id = var.project_name
}

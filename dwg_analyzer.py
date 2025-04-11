import ezdxf
import math
import os
import glob
import sys
import csv
from datetime import datetime

def calculate_column_volumes(dwg_file_path, height=4000):
    """
    DWG 파일에서 COL 레이어의 객체들 부피를 계산합니다.
    
    Args:
        dwg_file_path (str): DWG 파일 경로
        height (float): 객체의 높이 (mm)
    
    Returns:
        dict: 각 객체별 부피와 총 부피
    """
    try:
        # DWG 파일 열기
        doc = ezdxf.readfile(dwg_file_path)
        
        # 모델스페이스 가져오기
        msp = doc.modelspace()
        
        # COL 레이어의 객체들 필터링
        col_entities = [entity for entity in msp if entity.dxf.layer == "COL"]
        
        print(f"COL 레이어에서 {len(col_entities)}개의 객체를 찾았습니다.")
        
        total_volume = 0
        volumes = {}
        
        # 각 객체의 부피 계산
        for i, entity in enumerate(col_entities):
            volume = 0
            entity_type = entity.dxftype()
            
            if entity_type == "CIRCLE":
                # 원기둥의 부피 = π * 반지름² * 높이
                radius = entity.dxf.radius
                volume = math.pi * radius**2 * height
                
            elif entity_type == "LWPOLYLINE" or entity_type == "POLYLINE":
                # 폴리라인의 경우 닫힌 폴리라인이면 다각기둥으로 취급
                if entity.is_closed:
                    # 면적 계산
                    points = list(entity.vertices())
                    area = calculate_polygon_area(points)
                    volume = area * height
                
            elif entity_type == "LINE":
                # 라인은 부피가 없으므로 무시
                continue
                
            elif entity_type == "INSERT":
                # 블록 참조는 내부 객체 분석 필요 (복잡함)
                print(f"경고: 블록 참조({entity.dxf.name})는 부피 계산이 제한적입니다.")
                # 블록 내부 객체 처리를 추가하려면 여기서 확장
                
            elif entity_type == "HATCH":
                # 해치 패턴은 면적을 제공할 수 있음
                try:
                    area = entity.get_area()
                    volume = area * height
                except:
                    print(f"경고: HATCH 객체 #{i}의 면적을 계산할 수 없습니다.")
            
            if volume > 0:
                volumes[f"{entity_type}_{i}"] = volume
                total_volume += volume
                print(f"객체 #{i} ({entity_type}): {volume:.2f} mm³")
        
        print(f"총 부피: {total_volume:.2f} mm³")
        print(f"총 부피: {total_volume / 1000000000:.4f} m³")
        
        return {
            "objects": volumes,
            "total_volume_mm3": total_volume,
            "total_volume_m3": total_volume / 1000000000
        }
    
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        return None


def calculate_polygon_area(vertices):
    """
    폴리곤의 면적을 계산합니다 (신발끈 공식 사용).
    
    Args:
        vertices (list): (x, y) 좌표 튜플의 리스트
    
    Returns:
        float: 폴리곤의 면적
    """
    n = len(vertices)
    area = 0.0
    
    for i in range(n):
        j = (i + 1) % n
        area += vertices[i][0] * vertices[j][1]
        area -= vertices[j][0] * vertices[i][1]
    
    return abs(area) / 2.0


def find_dwg_files():
    """현재 디렉토리에서 DWG 파일들을 찾습니다."""
    return glob.glob("*.dwg")


def generate_estimate(volume_data, file_name, floor_num, concrete_type="24-21-150"):
    """
    부피 데이터를 기반으로 견적서를 생성합니다.
    
    Args:
        volume_data (dict): 부피 계산 결과
        file_name (str): DWG 파일 이름
        floor_num (str): 층 번호
        concrete_type (str): 콘크리트 규격
        
    Returns:
        dict: 견적 데이터
    """
    # 기본 단가 설정 (실제 프로젝트에서는 정확한 단가로 대체 필요)
    unit_prices = {
        "재료비": 120000,  # 1m³당 원
        "노무비": 80000,   # 1m³당 원
        "경비": 30000      # 1m³당 원
    }
    
    # 총 부피 (m³)
    volume_m3 = volume_data["total_volume_m3"]
    
    # 품명 생성 (예: "6층 기둥 콘크리트 타설")
    item_name = f"{floor_num}층 기둥 콘크리트 타설"
    
    # 규격 (예: "24-21-150")
    specification = concrete_type
    
    # 단위
    unit = "m³"
    
    # 수량 (총 부피)
    quantity = volume_m3
    
    # 각 비용 계산
    material_cost_unit = unit_prices["재료비"]
    material_cost_total = material_cost_unit * quantity
    
    labor_cost_unit = unit_prices["노무비"]
    labor_cost_total = labor_cost_unit * quantity
    
    expense_cost_unit = unit_prices["경비"]
    expense_cost_total = expense_cost_unit * quantity
    
    # 합계 계산
    total_unit_cost = material_cost_unit + labor_cost_unit + expense_cost_unit
    total_cost = material_cost_total + labor_cost_total + expense_cost_total
    
    # 견적 데이터 구성
    estimate_data = {
        "품명": item_name,
        "규격": specification,
        "단위": unit,
        "수량": quantity,
        "재료비 단가": material_cost_unit,
        "재료비 금액": material_cost_total,
        "노무비 단가": labor_cost_unit, 
        "노무비 금액": labor_cost_total,
        "경비 단가": expense_cost_unit,
        "경비 금액": expense_cost_total,
        "합계 단가": total_unit_cost,
        "합계 금액": total_cost
    }
    
    return estimate_data


def print_estimate_table(estimate_data):
    """견적 데이터를 표 형식으로 출력합니다."""
    print("\n" + "=" * 100)
    print(" " * 40 + "견적 내역서" + " " * 40)
    print("=" * 100)
    
    headers = ["품명", "규격", "단위", "수량", "재료비 단가", "재료비 금액", 
               "노무비 단가", "노무비 금액", "경비 단가", "경비 금액", "합계 단가", "합계 금액"]
    
    # 헤더 출력
    header_line = ""
    for header in headers:
        header_line += f"{header:<12}"
    print(header_line)
    print("-" * 100)
    
    # 데이터 행 출력
    data_line = ""
    data_line += f"{estimate_data['품명']:<12}"
    data_line += f"{estimate_data['규격']:<12}"
    data_line += f"{estimate_data['단위']:<12}"
    data_line += f"{estimate_data['수량']:.4f:<12}"
    data_line += f"{estimate_data['재료비 단가']:,.0f:<12}"
    data_line += f"{estimate_data['재료비 금액']:,.0f:<12}"
    data_line += f"{estimate_data['노무비 단가']:,.0f:<12}"
    data_line += f"{estimate_data['노무비 금액']:,.0f:<12}"
    data_line += f"{estimate_data['경비 단가']:,.0f:<12}"
    data_line += f"{estimate_data['경비 금액']:,.0f:<12}"
    data_line += f"{estimate_data['합계 단가']:,.0f:<12}"
    data_line += f"{estimate_data['합계 금액']:,.0f:<12}"
    print(data_line)
    
    print("=" * 100)


def save_to_csv(estimate_data, output_file):
    """견적 데이터를 CSV 파일로 저장합니다."""
    try:
        with open(output_file, 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ["품명", "규격", "단위", "수량", "재료비 단가", "재료비 금액", 
                         "노무비 단가", "노무비 금액", "경비 단가", "경비 금액", "합계 단가", "합계 금액"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerow(estimate_data)
            
        print(f"견적 내역이 {output_file}에 저장되었습니다.")
        return True
    except Exception as e:
        print(f"CSV 파일 저장 중 오류 발생: {str(e)}")
        return False


if __name__ == "__main__":
    # 현재 디렉토리에서 DWG 파일 찾기
    dwg_files = find_dwg_files()
    
    if not dwg_files:
        print("현재 폴더에 DWG 파일이 없습니다.")
        file_path = input("DWG 파일 경로를 직접 입력하세요: ")
    else:
        # 여러 파일이 있는 경우 선택 옵션 제공
        if len(dwg_files) == 1:
            file_path = dwg_files[0]
            print(f"'{file_path}' 파일을 처리합니다.")
        else:
            print("현재 폴더에서 다음 DWG 파일들을 찾았습니다:")
            for i, file in enumerate(dwg_files):
                print(f"{i+1}. {file}")
            
            selection = 0
            while selection < 1 or selection > len(dwg_files):
                try:
                    selection = int(input(f"처리할 파일 번호를 선택하세요 (1-{len(dwg_files)}): "))
                except ValueError:
                    print("유효한 숫자를 입력하세요.")
            
            file_path = dwg_files[selection-1]
    
    # 층 번호 입력 받기
    floor_num = input("층 번호를 입력하세요 (예: 6): ")
    
    # 높이 입력 받기
    height = 4000  # 기본값
    height_input = input("객체의 높이(mm)를 입력하세요 (기본값 4000mm, 그냥 Enter 누르면 기본값 사용): ")
    if height_input:
        try:
            height = float(height_input)
        except ValueError:
            print("유효한 숫자가 아닙니다. 기본값 4000mm을 사용합니다.")
    
    # 콘크리트 규격 입력
    concrete_type = input("콘크리트 규격을 입력하세요 (기본값: 24-21-150, 그냥 Enter 누르면 기본값 사용): ") or "24-21-150"
    
    print(f"파일: {file_path}, 높이: {height}mm로 계산합니다.")
    volume_result = calculate_column_volumes(file_path, height)
    
    if volume_result:
        print("\n상세 부피 결과:")
        for obj_id, volume in volume_result["objects"].items():
            print(f"{obj_id}: {volume:.2f} mm³")
            
        # 견적 데이터 생성
        estimate_data = generate_estimate(volume_result, file_path, floor_num, concrete_type)
        
        # 견적 표 출력
        print_estimate_table(estimate_data)
        
        # CSV 파일로 저장 옵션
        save_option = input("\n결과를 CSV 파일로 저장하시겠습니까? (y/n): ").lower()
        if save_option == 'y':
            now = datetime.now().strftime("%Y%m%d_%H%M%S")
            default_filename = f"견적내역_{floor_num}층_{now}.csv"
            filename = input(f"저장할 파일명을 입력하세요 (기본값: {default_filename}): ") or default_filename
            save_to_csv(estimate_data, filename) 